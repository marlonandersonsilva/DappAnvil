// filepath: /home/marlon/DappAnvil/scripts/Token.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/contracts/Token.sol";

contract DeployToken is Script {
    function run() external {
        // Carrega a chave privada do arquivo .env
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        // Inicia a transmissão da transação com a chave privada
        vm.startBroadcast(privateKey);

        // Realiza o deploy do contrato Token
        Token token = new Token();

        // Exibe o endereço do contrato implantado
        console.log("Token deployed to:", address(token));

        // Finaliza a transmissão da transação
        vm.stopBroadcast();
    }
}