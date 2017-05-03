OP-1 Patch Preview
---

This is the SVG and `<audio>` powered patch preview component featured on https://op1.fun. It has no
dependencies. To use it:

```javascript
OP1Player({
  audioElement :document.querySelector("#preview-audio-tag"),
  svgElement: document.querySelector("#waveform-svg-tag"),
  frameCount: 264600, // total number of frames in AIFF
  frames: [ /* floats representing sampled frames, more info below */ ],
  marks: [ /* integers of start points pulled from OP-1 metadata */ ],
  padding: 40 // distance from edge of SVG image area to draw waveform
});
```

There are numerous techniques for creating an array of frames suitable for waveform previews, but the
one I am using on op1.fun with this component looks like this (ruby):

```ruby
n_frames = 500 # number of frames to show in the preview
reduction_window = 100 # each preview frame is an average of 2x this many frames

n = buffer.size / n_frames
preview_frames = []
n_frames.times do |i|
  k = n*i
  if buffer[k]
    window = ((k-reduction_window)..(k+reduction_window)).map do |j|
      (buffer[j] || 0).abs
    end
    preview_frames << (window.max * 1000).floor / 1000.0
  end
end
```

I'd be happy to accept a PR turning this into an AMD or ES6 module.
