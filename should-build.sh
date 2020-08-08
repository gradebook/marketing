#! /bin/bash

test $INCOMING_HOOK_URL && echo 'Webhook found' || git diff $CACHED_COMMIT_REF --name-only | egrep '(scripts|styles)'
