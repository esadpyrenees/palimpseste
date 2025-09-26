local_stems_path="/Bureau/palimpseste-main/"
remote_stems_path="/home/palimpseste"
ssh_login="palimpseste"
ssh_host="https://palimpseste.alwaysdata.net"
port="22"

rsync -avz --progress -e "ssh -p $port" $local_stems_path $ssh_login@ssh_host: $remote_stems_path
