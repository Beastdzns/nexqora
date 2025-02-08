package com.example.nexqora_ait.util

import java.security.MessageDigest

fun String.sha256(): String {
    val bytes = (this+"SDRTHDD12lp").toByteArray()
    val md = MessageDigest.getInstance("SHA-256")
    val digest = md.digest(bytes)
    return digest.joinToString("") { "%02x".format(it) }
}