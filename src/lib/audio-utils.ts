/**
 * Shared audio helpers for fade-in, fade-out, and ambient pad.
 * Used by meditation, podcast, masterclass, and SOS.
 */

export const FADE_IN_MS = 120
export const FADE_OUT_MS = 120

const FADE_IN_DURATION = FADE_IN_MS / 1000
const FADE_OUT_DURATION = FADE_OUT_MS / 1000

export type VoiceRefs = {
  ctx: AudioContext
  gain: GainNode
}

/** Play HTMLAudioElement with smooth fade-in via Web Audio API. Returns refs for fade-out. */
export async function playAudioWithFadeIn(audio: HTMLAudioElement): Promise<VoiceRefs> {
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  const source = ctx.createMediaElementSource(audio)
  const gain = ctx.createGain()
  gain.gain.value = 0
  source.connect(gain)
  gain.connect(ctx.destination)
  if (ctx.state === 'suspended') await ctx.resume()
  gain.gain.setTargetAtTime(1, ctx.currentTime, FADE_IN_DURATION * 0.4)
  await audio.play()
  return { ctx, gain }
}

/** Fade out voice and run cleanup after fade completes */
export function stopVoiceWithFadeOut(
  audio: HTMLAudioElement | null,
  voiceRefs: VoiceRefs | null,
  url: string | undefined,
  onCleanup: () => void
): void {
  if (!audio) {
    onCleanup()
    return
  }
  if (voiceRefs) {
    voiceRefs.gain.gain.setTargetAtTime(0, voiceRefs.ctx.currentTime, FADE_OUT_DURATION * 0.4)
    setTimeout(() => {
      audio.pause()
      audio.src = ''
      if (url) URL.revokeObjectURL(url)
      try { voiceRefs.ctx.close() } catch { /* ignore */ }
      onCleanup()
    }, FADE_OUT_MS + 20)
  } else {
    audio.pause()
    audio.src = ''
    if (url) URL.revokeObjectURL(url)
    onCleanup()
  }
}

/** Create ambient synth pad with fade-in. Volume 0.15–0.25. */
export function createAmbientPad(ctx: AudioContext, volume = 0.2): { gain: GainNode; oscs: OscillatorNode[]; stop: () => void } {
  const gain = ctx.createGain()
  gain.gain.value = 0
  gain.connect(ctx.destination)
  const freqs = [65.41, 82.41, 98, 130.81, 164.81]
  const oscs: OscillatorNode[] = []
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = f
    const g = ctx.createGain()
    g.gain.value = (0.3 / (i + 1)) * (volume / 0.28)
    osc.connect(g)
    g.connect(gain)
    osc.start()
    oscs.push(osc)
  })
  gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.08)

  const stop = () => {
    gain.gain.setTargetAtTime(0, ctx.currentTime, FADE_OUT_DURATION * 0.4)
    setTimeout(() => {
      oscs.forEach(o => { try { o.stop(ctx.currentTime) } catch { /* ignore */ } })
      try { ctx.close() } catch { /* ignore */ }
    }, FADE_OUT_MS + 20)
  }
  return { gain, oscs, stop }
}
