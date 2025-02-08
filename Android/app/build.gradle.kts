plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.google.gms.google.services)

    kotlin("plugin.serialization") version "2.0.21"
}

android {
    namespace = "com.example.nexqora_ait"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.nexqora_ait"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.firebase.storage)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)

    implementation(libs.firebase.firestore)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.firebase.auth)
    implementation(libs.firebase.database)

    implementation(libs.kotlinx.serialization.json)
    implementation(libs.play.services.auth)

//    implementation(libs.coil.compose)

    implementation("io.insert-koin:koin-androidx-compose:3.2.0")

    implementation(libs.koin.android)
    implementation(libs.koin.androidx.compose)

    implementation(libs.ktor.client.okhttp)

    api(libs.koin.core)
    implementation(libs.koin.compose)
    implementation(libs.lifecycle.viewmodel)

    // ktor bundle
    implementation(libs.bundles.ktor)

    // image loading library
    implementation("io.coil-kt:coil-compose:2.7.0")

    implementation("com.airbnb.android:lottie-compose:6.0.0")

    implementation("io.metamask.androidsdk:metamask-android-sdk:0.6.6")

//    implementation("com.walletconnect:android-core:2.0.0")  // WalletConnect SDK
//    implementation("com.walletconnect:android-sign:2.0.0")  // WalletConnect Signing API
//    implementation("org.web3j:core:4.9.3")
//
//    implementation(platform("com.walletconnect:android-bom:1.35.0"))
//    implementation("com.walletconnect:android-core")
//    implementation("com.walletconnect:sign")
////    implementation("com.walletconnect:android-sign")
//    implementation("com.walletconnect:web3wallet")
//
//    implementation("com.squareup.okhttp3:okhttp:4.9.3") // For networking
//    implementation("com.google.code.gson:gson:2.8.9")

}