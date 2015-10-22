var bitcoin = require('bitcoinjs-lib')
var bs58check = require('bs58check')

var txHexToJSON = function (hex) {
  var tx = bitcoin.Transaction.fromHex(hex)
  var txid = tx.getId()
  var vin = []
  tx.ins.forEach(function (input) {
    var input_txid = bitcoin.bufferutils.reverse(input.hash).toString('hex')
    var input_hex = ''
    var input_addresses = []
    if (input.script.chunks.length === 2) {
      var pubKey = input.script.chunks[1]
      if (typeof (pubKey) !== 'object') {
        pubKey = new Buffer(pubKey)
      }
      var pubKeyHash = bitcoin.crypto.hash160(pubKey)
      var payload = new Buffer(21)
      payload.writeUInt8(bitcoin.networks.testnet.pubKeyHash, 0)
      pubKeyHash.copy(payload, 1)
      var address = bs58check.encode(payload)
      input_addresses = [address]
      input_hex = input.script.buffer.toString('hex')
    }
    vin.push({
      txid: input_txid,
      txId: input_txid,
      vout: input.index,
      scriptSig: {
        hex: input_hex
      },
      sequence: input.sequence,
      addresses: input_addresses
    })
  })
  var vout = []
  tx.outs.forEach(function (output, index) {
    var script_type = bitcoin.scripts.classifyOutput(output.script)
    var address = script_type === 'pubkeyhash' || script_type === 'scripthash' ? bitcoin.Address.fromOutputScript(output.script, bitcoin.networks.testnet).toString() : null
    vout.push({
      value: output.value,
      index: index,
      n: index,
      scriptPubKey: {
        hex: output.script.buffer.toString('hex'),
        asm: output.script.toASM(),
        type: script_type,
        addresses: [address]
      }
    })
  })
  return {
    confirmations: null,
    blockheight: null,
    blocktime: null,
    blockhash: null,
    timeReceived: new Date().getTime(),
    txHex: hex,
    hex: hex,
    txid: txid,
    txId: txid,
    version: tx.version,
    locktime: tx.locktime,
    vin: vin,
    vout: vout
  }
}

module.exports = txHexToJSON
