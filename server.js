const express = require('express')
const {NodeSSH} = require('node-ssh')
require('dotenv').config()

const ssh = new NodeSSH()

const app = express()
const PORT = 3000

const username = process.env.USER_NAME
const keypath = `C:\\Users\\Tristan\\.ssh\\id_rsa`

app.get('/:server', async (req, res) => {
	const {server} = req.params;
	const address = "csciarch0" + server + ".millersville.edu"

	await ssh.connect({
		host: address,
		username: username,
		privateKeyPath: keypath
	})

	console.log(`CS Arch Server ${server} Statistics: `)
	ssh.execCommand(`top -b -n=1 | grep '%Cpu\\|MiB Mem'`).then(function(result) {
		var output = result.stdout;
		var cpuUsage = Number(output.substring(output.indexOf(":") + 1, output.indexOf("us")).trim());
		var memUsage = Number(output.substring(output.indexOf("free,") + 5, output.indexOf("used")).trim());
		var memTotal = Number(output.substring(output.indexOf("Mem :") + 5, output.indexOf("total")).trim());
		var memPct = memUsage/memTotal
		memPct = (memPct.toFixed(2)) * 100
		console.log("CPU Usage:", cpuUsage, "%")
		console.log("Mem Usage:", memPct, "%")
	})
})

app.listen(PORT)