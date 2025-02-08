package com.example.nexqora_ait

import android.app.Application
import android.content.Context
//import com.example.nexqora_ait.mvvm.appModule
import com.example.nexqora_ait.mvvm.sharedModule
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin

class MyApp: Application() {

    override fun onCreate() {
        super.onCreate()
        KoinInitializer(applicationContext).init()
    }
}

class KoinInitializer(
    private val context: Context
) {
     fun init() {

        startKoin {
            androidContext(context)
            androidLogger()
            modules(sharedModule)
        }

    }
}