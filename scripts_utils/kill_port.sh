out=`sudo lsof -i -P -n | grep $1 | tr -s ' ' | cut -d ' ' -f2`
if [ -z "$out" ]
then
	echo "no program is running with port " $out
else
	echo "Killed " $out
	sudo kill $out
fi
