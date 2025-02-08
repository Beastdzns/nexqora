package com.example.nexqora_ait.util

import kotlin.math.roundToInt

fun Double.formatToTwoDecimalPlaces(): String {
    val rounded = (this * 100).roundToInt() / 100.0
    return rounded.toString()
}
