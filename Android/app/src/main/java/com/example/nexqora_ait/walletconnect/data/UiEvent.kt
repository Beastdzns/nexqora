package com.example.nexqora_ait.walletconnect.data

sealed class UiEvent {
    data class Message(val error: String) : UiEvent()
}