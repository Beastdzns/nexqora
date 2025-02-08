package com.example.nexqora_ait.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.nexqora_ait.ui.theme.ThemeColors

fun Modifier.mainLayoutDefaults(): Modifier {
    return this.fillMaxSize().background(color = ThemeColors.BackgroundColor).padding(top = 24.dp)
}