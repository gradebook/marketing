#! /bin/sh

echo "Checking if build should run relative to $CACHED_COMMIT_REF"

# 0 means exit EARLY

if [ -z "$INCOMING_HOOK_URL" ]; then
	git diff $CACHED_COMMIT_REF --name-only | egrep '(scripts|styles|src)' -v --silent
else
	echo 'Webhook found'
	exit 1
fi

