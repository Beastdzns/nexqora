package com.example.nexqora_ait.viewmodel

import android.content.Context
import android.widget.Toast
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nexqora_ait.data.ProfileDetails
import com.example.nexqora_ait.data.VerificationDetails
import com.example.nexqora_ait.util.UserRegistrationStatus
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.auth.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {

    private val firestore = FirebaseFirestore.getInstance()
    private val mAuth = FirebaseAuth.getInstance()
    private val user: FirebaseUser = mAuth.currentUser!!

    private val database = FirebaseDatabase.getInstance()

    private var _profileData: MutableStateFlow<ProfileDetails> = MutableStateFlow(ProfileDetails())
    val profileDetails: StateFlow<ProfileDetails> = _profileData

    private var _verificationDetails: MutableStateFlow<VerificationDetails> =
        MutableStateFlow(VerificationDetails())
    val verificationDetails: StateFlow<VerificationDetails> = _verificationDetails

    private var _userRegistrationStatus: MutableStateFlow<UserRegistrationStatus?> =
        MutableStateFlow(null)
    val userRegistrationStatus: StateFlow<UserRegistrationStatus?> = _userRegistrationStatus

    fun getProfileDetails() {
        viewModelScope.launch {
            try {

                firestore.collection("users")
                    .document(user.uid)
                    .get()
                    .addOnSuccessListener {
                        val user = it.toObject(ProfileDetails::class.java)
                        if (user != null) {
                            _profileData.value = user
                        }
                    }

            } catch (_: Exception) {

            }
        }
    }

    fun getVerificationDetails() {
        viewModelScope.launch {
            try {

                firestore.collection("verification")
                    .document(user.uid)
                    .get()
                    .addOnSuccessListener {
                        val details = it.toObject(VerificationDetails::class.java)
                        if (details != null) {
                            _verificationDetails.value = details
                        }
                    }


            } catch (_: Exception) {

            }
        }
    }

    fun checkUserRegistered(): Pair<ProfileDetails, VerificationDetails> {

        viewModelScope.launch {
            getProfileDetails()
            getVerificationDetails()
            _userRegistrationStatus.value =
                if (_profileData.value.verified) {
                    UserRegistrationStatus.VERIFIED
                } else if (_profileData.value.name == "") {
                    UserRegistrationStatus.PROFILE_NOT_CREATED
                } else if (_verificationDetails.value.aadharImage == "") {
                    UserRegistrationStatus.IMAGE_NOT_UPLOADED
                } else if (!_profileData.value.verified) {
                    UserRegistrationStatus.UNVERIFIED
                } else {
                    UserRegistrationStatus.LOADING
                }
        }

        return Pair(_profileData.value, _verificationDetails.value)

    }

    fun createProfile(
        profileDetails: ProfileDetails,
        success: (Boolean) -> Unit
    ) {

        viewModelScope.launch {
            try {
                firestore.collection("users")
                    .document(user.uid)
                    .set(
                        profileDetails.copy(
                            email = user.email ?: "No Email Was Present While Registration",
                            userID = user.uid
                        )
                    )
                    .addOnSuccessListener {
                        success(true)
                    }.addOnFailureListener {
                        success(false)
                    }
            } catch (e: Exception) {
                success(false)
            }
        }

    }

    fun addVerificationImages(
        verificationDetails: VerificationDetails,
        success: (Boolean) -> Unit
    ) {

        viewModelScope.launch {
            try {
                firestore.collection("verification")
                    .document(user.uid)
                    .set(
                        verificationDetails
                    )
                    .addOnSuccessListener {
                        success(true)
                    }.addOnFailureListener {
                        success(false)
                    }
            } catch (e: Exception) {
                success(false)
            }
        }

    }


}