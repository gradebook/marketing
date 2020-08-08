#! /bin/sh

echo "Checking if build should run"

# 0 means exit EARLY

if [ -z "$INCOMING_HOOK_URL" ]; then
	git diff $CACHED_COMMIT_REF --name-only | egrep '(scripts|styles)' -v --silent
else
	echo 'Webhook found'
	exit 1
fi

