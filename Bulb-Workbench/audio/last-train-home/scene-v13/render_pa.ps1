$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$sceneSynth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
try {
    $sceneVoice = @($sceneSynth.GetInstalledVoices() | Where-Object {
        $_.Enabled -and $_.VoiceInfo.Culture.Name -eq 'en-US'
    })[0]
    if (-not $sceneVoice) { throw 'No installed offline en-US voice; no fallback or installation.' }
    $sceneSynth.SelectVoice($sceneVoice.VoiceInfo.Name)
    $sceneSynth.Rate = -1
    $sceneSynth.Volume = 100
    $sceneLines = @(
        @{ file = 'pa-approach-raw.wav'; text = 'The late local service is now approaching platform two.' },
        @{ file = 'pa-departure-raw.wav'; text = 'The late local service at platform two will depart shortly.' }
    )
    foreach ($sceneLine in $sceneLines) {
        $sceneOutput = Join-Path $PSScriptRoot $sceneLine.file
        if (Test-Path -LiteralPath $sceneOutput) { throw 'Refusing to overwrite speech source.' }
        # File output is selected before Speak; there is no speaker playback.
        $sceneSynth.SetOutputToWaveFile($sceneOutput)
        $sceneSynth.Speak($sceneLine.text)
        $sceneSynth.SetOutputToNull()
    }
    $sceneHasher = [Security.Cryptography.SHA256]::Create()
    try {
        $sceneVoiceHash = [BitConverter]::ToString($sceneHasher.ComputeHash(
            [Text.Encoding]::UTF8.GetBytes($sceneVoice.VoiceInfo.Name))).Replace('-', '').ToLowerInvariant()
    } finally { $sceneHasher.Dispose() }
    $sceneReceipt = @{
        engine = 'Windows System.Speech local installed synthesis'
        voiceCulture = $sceneVoice.VoiceInfo.Culture.Name
        voiceNameSha256 = $sceneVoiceHash
        rate = -1
        output = 'WAV file only; no playback or online fallback'
        lines = $sceneLines
    } | ConvertTo-Json -Depth 5
    $sceneReceiptPath = Join-Path $PSScriptRoot 'speech-provenance.json'
    if (Test-Path -LiteralPath $sceneReceiptPath) { throw 'Refusing to overwrite speech receipt.' }
    [IO.File]::WriteAllText($sceneReceiptPath, $sceneReceipt, [Text.UTF8Encoding]::new($false))
    Write-Output 'Two original fictional announcements rendered offline to WAV files; no playback.'
} finally { $sceneSynth.Dispose() }
