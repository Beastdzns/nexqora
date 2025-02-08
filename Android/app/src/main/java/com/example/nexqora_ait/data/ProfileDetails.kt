package com.example.nexqora_ait.data

import androidx.annotation.Keep
import kotlinx.serialization.Serializable

@Keep
@Serializable
data class ProfileDetails(
    val name: String = "",
    val userID: String = "",
    val mobileNo: String = "",
    val aadharCardHash: String = "",
    val panCard: String = "",
    val email: String = "",
    val verified: Boolean = false,
)

@Keep
@Serializable
data class VerificationDetails(
    val userID: String = "",
    val aadharImage: String = "",
    val panImage: String = "",
)
