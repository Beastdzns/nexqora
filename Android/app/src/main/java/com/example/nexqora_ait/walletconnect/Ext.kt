package com.example.nexqora_ait.walletconnect

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import kotlinx.coroutines.plus

//fun ViewModel.launch(block: suspend CoroutineScope.() -> Unit) {
//    viewModelScope.launch(block = block)
//}
//
//@Composable
//fun <T : Any> OnEvent(
//    events: Flow<T>,
//    handleEvent: (T) -> Unit,
//) {
//    require(events !is StateFlow<*>) { "Events flow cannot be StateFlow" }
//
//    LaunchedEffect(Unit, events) {
//        events.onEach { event ->
//            handleEvent(event)
//        }.launchIn(this + Dispatchers.Main.immediate)
//    }
//}