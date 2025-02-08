package com.example.nexqora_ait

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.rememberNavController
import com.example.nexqora_ait.nav.RootNavGraph
import com.example.nexqora_ait.ui.components.mainLayoutDefaults
import com.example.nexqora_ait.ui.theme.NexQoraAITTheme
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.viewmodel.SharedViewModel
import com.example.nexqora_ait.walletconnect.data.UiEvent
import com.example.nexqora_ait.welcome.SplashScreenLogin
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import org.koin.compose.KoinContext
import org.koin.compose.currentKoinScope

class MainActivity : ComponentActivity() {

    companion object {
        const val RC_SIGN_IN = 100
    }

    private lateinit var mAuth: FirebaseAuth
    private lateinit var googleSignInClient: GoogleSignInClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // firebase auth instance
        mAuth = FirebaseAuth.getInstance()

        // configure Google SignIn
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)


        enableEdgeToEdge()

        setContent {

//            val uiState by walletViewModel.uiState.collectAsState()
//
//            LaunchedEffect(key1 = uiState.isConnecting) {
//                walletViewModel.updateBalance()
//            }
//
//            val context = LocalContext.current
//
//            OnEvent(events = walletViewModel.uiEvent) { event ->
//                when (event) {
//                    is UiEvent.Message -> {
//                        Toast.makeText(
//                            context,
//                            event.error,
//                            Toast.LENGTH_SHORT
//                        ).show()
//                    }
//                }
//            }

            NexQoraAITTheme(darkTheme = true) {

                if (mAuth.currentUser == null) {

                    Column(
                        modifier = Modifier.mainLayoutDefaults(),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        SplashScreenLogin {
                            signIn()
                        }
                    }
                } else {

                    KoinContext {

                        val sharedViewModel = koinViewModel<SharedViewModel>()

                        RootNavGraph(
                            navController = rememberNavController(),
                            mainViewModel = viewModel(),
                            sharedViewModel = sharedViewModel,
                        )
                    }


                }

            }
        }
    }

    private fun signIn() {
        val signInIntent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        // result returned from launching the intent from GoogleSignInApi.getSignInIntent()
        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            val exception = task.exception
            if (task.isSuccessful) {
                try {
                    // Google SignIn was successful, authenticate with Firebase
                    val account = task.getResult(ApiException::class.java)!!
                    Log.d("SignIn", "firebaseAuthWithGoogle:" + account.idToken)
                    firebaseAuthWithGoogle(account.idToken!!)
                } catch (e: Exception) {
                    // Google SignIn Failed
                    Log.d("SignIn", "Google SignIn Failed")
                }
            } else {
                Log.d("SignIn", exception.toString())
            }
        }

    }

    private fun firebaseAuthWithGoogle(idToken: String) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        mAuth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    // SignIn Successful
                    Toast.makeText(this, "SignIn Successful", Toast.LENGTH_SHORT).show()
                    setContent {

                        NexQoraAITTheme(darkTheme = true) {

                            KoinContext {
                                val sharedViewModel = koinViewModel<SharedViewModel>()

                                RootNavGraph(
                                    navController = rememberNavController(),
                                    mainViewModel = viewModel(),
                                    sharedViewModel = sharedViewModel,
                                )
                            }

                        }
                    }
                } else {
                    // SignIn Failed
                    Toast.makeText(this, "SignIn Failed", Toast.LENGTH_SHORT).show()
                }
            }
    }
}

@Composable
inline fun <reified T: ViewModel> koinViewModel(): T {
    val scope = currentKoinScope()
    return viewModel {
        scope.get<T>()
    }
}
