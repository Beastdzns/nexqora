package com.example.nexqora_ait.presentation.bottom_nav.utility

import androidx.compose.runtime.Stable

@Stable
object BottomNavConstants {

    @Stable
    val HomeScreenCards = mapOf(
        "Scan" to HomeScreenImages.scan,
        "Receive" to HomeScreenImages.qrcode,
        "Buy" to HomeScreenImages.dollar,
        "Transfer" to HomeScreenImages.transfer
    )

}