// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fibonacci {
    function fib(uint256 n) external pure returns (uint256) {
        if (n == 0 || n == 1) return n;

        uint256 n1 = 0;
        uint256 n2 = 1;

        for (uint256 i = 2; i < n; i++) {
            uint256 n0 = n1;
            n1 = n2;
            n2 = n0 + n1;
        }
        return n1 + n2;
    }
}
