package com.example.nexqora_ait.walletconnect.data

sealed class EventSink {
    data object GetBalance : EventSink()
    data object Connect : EventSink()
    data object Disconnect : EventSink()
}