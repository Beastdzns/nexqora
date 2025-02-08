package com.example.nexqora_ait.welcome

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieCompositionSpec
import com.airbnb.lottie.compose.LottieConstants
import com.airbnb.lottie.compose.animateLottieCompositionAsState
import com.airbnb.lottie.compose.rememberLottieComposition
import com.example.nexqora_ait.R
import com.example.nexqora_ait.presentation.MainScreen
import com.example.nexqora_ait.presentation.bottom_nav.HomeScreen
import com.example.nexqora_ait.ui.components.mainLayoutDefaults
import com.example.nexqora_ait.ui.theme.LARGE
import com.example.nexqora_ait.ui.theme.LightestBlue
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.viewmodel.MainViewModel
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.delay
import kotlinx.serialization.Serializable


@Serializable
object SplashScreen

@Composable
fun SplashScreen(
    navController: NavController,
    mainViewModel: MainViewModel
) {

    var delay by remember {
        mutableStateOf(true)
    }

    val mAuth = FirebaseAuth.getInstance()
    val user: FirebaseUser = mAuth.currentUser!!

    mainViewModel.checkUserRegistered()
    val userRegistrationStatus by mainViewModel.userRegistrationStatus.collectAsState()

//    val isProfileCreated by mainViewModel.profileExist.collectAsState()

    if (delay) {
        Column(
            modifier = Modifier.mainLayoutDefaults(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            SplashScreenContent()
        }
    }

    LaunchedEffect(Unit) {
        delay(4000)
        delay = false
        navController.popBackStack()

//        when (userRegistrationStatus) {
//            UserRegistrationStatus.VERIFIED -> navController.navigate(HomeScreen)
//            UserRegistrationStatus.PROFILE_NOT_CREATED -> navController.navigate(CreateProfileScreen)
//            UserRegistrationStatus.IMAGE_NOT_UPLOADED -> navController.navigate(UploadFilesScreen)
//            UserRegistrationStatus.UNVERIFIED -> navController.navigate(UnverifiedScreen)
//            UserRegistrationStatus.LOADING -> {
//
//            }
//            null -> {
//
//            }
//        }

        val registrationDetails = mainViewModel.checkUserRegistered()

        val userData = registrationDetails.first
        val verificationDetails = registrationDetails.second

        if (userData.name == "") {
            navController.navigate(CreateProfileScreen)
        } else if (verificationDetails.aadharImage == "") {
            navController.navigate(UploadFilesScreen)
        } else if (!userData.verified) {
            navController.navigate(UnverifiedScreen)
        } else {
            navController.navigate(MainScreen)
        }

    }

}

@Composable
fun SplashScreenContent() {

    val composition by rememberLottieComposition(
        LottieCompositionSpec.RawRes(R.raw.wel)
    )

    val compositionProgressBar by rememberLottieComposition(
        LottieCompositionSpec.RawRes(R.raw.prog)
    )

    val progress by animateLottieCompositionAsState(
        composition,
        iterations = LottieConstants.IterateForever,
        isPlaying = true,
        speed = 1f,
        restartOnPlay = false
    )

    LottieAnimation(
        modifier = Modifier.width(400.dp).height(350.dp),
        composition = composition,
        progress= progress
    )

    Spacer(modifier = Modifier.height(30.dp))


    Text("Welcome to NexQora!", fontSize = LARGE, fontWeight = FontWeight.Bold, color = ThemeColors.TextColor)

    Spacer(modifier = Modifier.height(50.dp))

    LottieAnimation(
        modifier = Modifier.size(150.dp),
        composition = compositionProgressBar,
        progress= progress
    )

}

@Composable
fun SplashScreenLogin(
    signInClicked: () -> Unit
) {

    Image(
        painter = painterResource(R.drawable.sign),
        contentDescription = "Welcome",
        modifier = Modifier
            .width(250.dp)
            .height(200.dp)
    )

    Spacer(modifier = Modifier.height(30.dp))

    Text("Please login in to get started!", fontSize = LARGE, fontWeight = FontWeight.Bold)

    Spacer(modifier = Modifier.height(50.dp))

    GoogleSignInButton(signInClicked)

}

@Composable
fun GoogleSignInButton(
    signInClicked: () -> Unit
) {

    Column {
        Card(
            modifier = Modifier
                .padding(start = 30.dp, end = 30.dp)
                .height(75.dp)
                .fillMaxWidth()
                .padding(vertical = 10.dp)
                .clickable {
                    signInClicked()
                },
            shape = RoundedCornerShape(50),
            elevation = CardDefaults.elevatedCardElevation(5.dp),
            colors = CardDefaults.cardColors(LightestBlue)
        ) {
            Row(modifier = Modifier.fillMaxSize(), verticalAlignment = Alignment.CenterVertically) {
                Image(
                    modifier = Modifier
                        .padding(start = 15.dp)
                        .size(32.dp)
                        .padding(0.dp)
                        .align(Alignment.CenterVertically),
                    painter = painterResource(id = R.drawable.ic_google_logo),
                    contentDescription = "google_logo"
                )

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {

                    Text(
                        modifier = Modifier
                            .padding(start = 20.dp),
                        text = "Sign In With Google",
                        fontSize = LARGE,
                    )
                }
            }
        }
    }
}