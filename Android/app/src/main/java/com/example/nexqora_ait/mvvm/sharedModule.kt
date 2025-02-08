package com.example.nexqora_ait.mvvm

import com.example.nexqora_ait.data.CryptoCurrencyRepository
import com.example.nexqora_ait.data.KtorClient
import com.example.nexqora_ait.viewmodel.SharedViewModel
import org.koin.dsl.module

val sharedModule = module {
    single { KtorClient.client } // Provide Ktor client
    single { CryptoCurrencyRepository(get()) } // Provide repository
    single { SharedViewModel(get()) } // Provide ViewModel
}