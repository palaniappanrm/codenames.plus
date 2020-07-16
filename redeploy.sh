#!/bin/sh
set -eu

NO_PLAYERS_STATUS='{"players":0,"rooms":0}'
DEFAULT_URL="http://localhost:2000"

OPTIONS=nfh
LONGOPTS=dry-run,force,help,git-reset,git-pull

# From https://stackoverflow.com/a/29754866
# -regarding ! and PIPESTATUS see above
# -temporarily store output to be able to check for errors
# -activate quoting/enhanced mode (e.g. by writing out “--options”)
# -pass arguments only via   -- "$@"   to separate them correctly
PARSED=$(getopt --options=$OPTIONS --longoptions=$LONGOPTS --name "$0" -- "$@")
# read getopt’s output this way to handle the quoting right:
eval set -- "$PARSED"

dryrun=n
force=n
git=n
url=""
while true
do
    case "$1" in
        -h|--help)
            cat <<EOF
Usage: $0 [OPTIONS...] [URL]
    URL defaults to $DEFAULT_URL

    OPTIONS for $0
      -h, --help         display this help and exit
      -n, --dry-run      only check status and display what would be done
                         the exit code will be 0 only if the server is unused
      -f, --force        perform redeploy even if server is in use
      -g, --git-pull     run "git pull" before redeploying
          --git-reset    run "git fetch && git reset --hard "
      -p, --pid=N        pid of a process
      -e, --exe=FILE     name of a executable program file
      -P, --path=PATH    absolute path name of a

EOF
            exit 2
            ;;
        -n|--dry-run)
            dryrun=y
            shift
            ;;
        -f|--force)
            force=y
            shift
            ;;
        --git-pull)
            if [ "$git" = "n" ]
            then
                git=pull
            else
                echo "Only one of --git-pull or --git-reset can be set."
                exit 4
            fi
            shift
            ;;
        --git-reset)
            if [ "$git" = "n" ]
            then
                git=reset
            else
                echo "Only one of --git-pull or --git-reset can be set."
                exit 4
            fi
            shift
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Programming error"
            exit 3
            ;;
    esac
done

if [ $# -eq 1 ]
then
    url="${1%/}/status"
elif [ $# -gt 1 ]
then
    echo "$0: Unexpected arguments $*"
    exit 5
else
    url=$DEFAULT_URL/status
fi

echo "Checking status using URL $url..."
if ! status=$(curl --fail --silent "$url")
then
    echo "Failed to check status."
    if [ "$force" = "y" ]
    then
        echo "--force set, so redeploying anyway..."
    else
        echo "Check the URL and use --force to redeploy if the server really is down."
        exit 1
    fi
else
    echo "Current status: $status"
    if [ "$status" != "$NO_PLAYERS_STATUS" ]
    then
        echo "Server not empty."
        if [ "$force" = "y" ]
        then
            echo "--force set, so redeploying anyway..."
        else
            echo "Canceling redeploy."
            exit 1
        fi
    fi
fi

if [ "$dryrun" = "y" ]
then
    echo "--dry-run set, only displaying redeploy commands..."
else
    echo "Redeploying..."
fi

if [ "$git" = "pull" ]
then
    echo "git pull"
    [ "$dryrun" = "n" ] && git pull
elif [ "$git" = "reset" ]
then
    remote_branch="$(git rev-parse --symbolic-full-name --abbrev-ref '@{u}')"
    echo "git fetch"
    [ "$dryrun" = "n" ] && git fetch
    echo "git reset --hard $remote_branch"
    [ "$dryrun" = "n" ] && git reset --hard "$remote_branch"
fi

echo "docker-compose build"
[ "$dryrun" = "n" ] && docker-compose build
echo "docker-compose up -d"
[ "$dryrun" = "n" ] && docker-compose up -d
