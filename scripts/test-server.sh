#!/bin/sh

usage() {
  echo "\nUsage: `basename $0` [-h] [HTTP_PORT] [P2P_PORT]"
  echo "where:"
  echo "\t-h\t\tshow this help text"
  echo "\tHTTP_PORT\tset the HTTP_PORT (default: 3000)"
  echo "\tP2P_PORT\tset the P2P_PORT (default: 5000)"  
  echo "\tPEERS\t web socket peer (default: -, ex: ws://localhost:5001)."
}

if [ "$1" == "-h" ]; then
  usage
  exit 0
fi

#set defaults
HTTP_PORT=${1:-3000}
P2P_PORT=${2:-5000}
PEERS=$3

IS_NVM=$(echo `command -v nvm`)

if [[ 'nvm' -eq ${IS_NVM} ]]; then
  #nvm command is a shell function declared in ~/.nvm/nvm.sh
  source $NVM_DIR/nvm.sh;
  nvm use 9
fi

CMD="HTTP_PORT=${HTTP_PORT} P2P_PORT=${P2P_PORT}"

if [[ ! -z $PEERS ]]; then
  echo "PEERS is set to '$PEERS'"
  CMD="${CMD} PEERS=${PEERS}"
fi

CMD="${CMD} npm run dev"

echo "Running: ${CMD}"

eval $CMD

exit 0
