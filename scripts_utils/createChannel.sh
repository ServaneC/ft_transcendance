curl -X POST 127.0.0.1:3000/channel -H 'Content-Type: application/json' -d '{"channelName":"'$1'","password":"'$2'", "isPublic":"true", "owner":"2"}'
