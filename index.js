var bitcoin = require('bitcoinjs-lib');

var txHexToJSON = function(hex) {
  var tx = bitcoin.Transaction.fromHex(hex);
  var txid = tx.getId();
  var vin = [];
  tx.ins.forEach(function(input) {
    var input_txid = bitcoin.bufferutils.reverse(input.hash).toString("hex");
    vin.push({
      txid: input_txid,
      txId: input_txid,
      vout: input.index,
      scriptSig: {
        hex: input.script.buffer.toString("hex")
      },
      sequence: input.sequence,
      addresses: ["msLoJikUfxbc2U5UhRSjc2svusBSqMdqxZ"]
    });
  });
  var vout = [];
  tx.outs.forEach(function(output, index) {
    var script_type = bitcoin.scripts.classifyOutput(output.script);
    var address = script_type == "pubkeyhash" ? bitcoin.Address.fromOutputScript(output.script, bitcoin.networks.testnet).toString() : null;
    vout.push({
      value: output.value,
      index: index,
      n: index,
      scriptPubKey: {
        hex: output.script.buffer.toString("hex"),
        asm: output.script.toASM(),
        type: script_type,
        addresses: [address]
      }
    });
  });
  return {
    confirmations: null,
    blockindex: null,
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
};

module.exports = txHexToJSON;
