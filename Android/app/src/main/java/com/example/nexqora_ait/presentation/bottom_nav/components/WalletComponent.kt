package com.example.nexqora_ait.presentation.bottom_nav.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nexqora_ait.walletconnect.data.EventSink

@Composable
fun WalletConnectScreen(isConnecting: Boolean, balance: String?, eventSink: (EventSink) -> Unit) {

    Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                Icons.Filled.AccountCircle,
                contentDescription = "Wallet Icon",
                modifier = Modifier.size(100.dp),
                tint = Color(0xFF3F51B5)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                "Your Wallet",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF3F51B5)
            )
            Spacer(modifier = Modifier.height(8.dp))
            if (isConnecting) {
                Text(
                    "Balance: $balance",
                    fontSize = 18.sp,
                    color = Color.DarkGray
                )
                Spacer(modifier = Modifier.height(24.dp))
                Button(
                    onClick = { eventSink(EventSink.Disconnect) },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEC407A))
                ) {
                    Text("Logout", color = Color.White)
                }
            } else {
                Button(
                    onClick = { eventSink(EventSink.Connect) },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50))
                ) {
                    Text("Connect", color = Color.White)
                }
            }
        }
    }
}