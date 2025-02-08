package com.example.nexqora_ait.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nexqora_ait.data.CryptoCurrencyRepository
import com.example.nexqora_ait.domain.CryptoCurrency
import com.example.nexqora_ait.util.error_handlers.NetworkError
import com.example.nexqora_ait.util.error_handlers.onError
import com.example.nexqora_ait.util.error_handlers.onSuccess
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class SharedViewModel(
    private val repository: CryptoCurrencyRepository
) : ViewModel() {

    private val _cryptoCurrencyList = MutableStateFlow<List<CryptoCurrency>>(emptyList())
    val cryptoCurrencyList: StateFlow<List<CryptoCurrency>> = _cryptoCurrencyList

    private val _networkError = MutableStateFlow<NetworkError?>(null)
    val networkError: StateFlow<NetworkError?> = _networkError

    val loadingCryptoCurrencies = MutableStateFlow(false)

    fun getCryptoCurrencies() {
        viewModelScope.launch {
            loadingCryptoCurrencies.emit(true)
            try {
                repository.getCryptoCurrencies()
                    .onSuccess {
                        _cryptoCurrencyList.emit(it)
                        loadingCryptoCurrencies.emit(false)
                    }.onError {
                        _networkError.emit(it)
                        loadingCryptoCurrencies.emit(false)
                    }
            } catch (e: Exception) {
                _networkError.emit(NetworkError.UNKNOWN)
                loadingCryptoCurrencies.emit(false)
            }
        }
    }

    private val _currencyMarketData = MutableStateFlow<List<Pair<Long, Double>>>(emptyList())
    val currencyMarketData: StateFlow<List<Pair<Long, Double>>> = _currencyMarketData

    fun getMarketChart(cryptoId: String, currency: String = "usd", days: Int = 1) {

        viewModelScope.launch {
            try {
                repository.getMarketChart(cryptoId, currency, days)
                    .onSuccess {
                        _currencyMarketData.emit(it)
                    }.onError {
                        _networkError.emit(it)
                    }
            } catch (e: Exception) {
                _networkError.emit(NetworkError.UNKNOWN)
            }

        }

    }

    fun emptyMarketChart() {
        viewModelScope.launch {
            _currencyMarketData.emit(emptyList())
        }
    }
}