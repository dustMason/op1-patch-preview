window.OP1Player = function(options) {
  var audioElement = options.audioElement;
  var svgElement = options.svgElement;
  var frameCount = options.frameCount;
  var frames = options.frames;
  var marks = options.marks;
  var padding = options.padding;
  
  var labelsPadding = 20;
  // frames per mystery unit == 4057.96367829781
  var length = frameCount * 4057.96367829781;
  var width = frames.length * 2;
  
  // waveform preview
  
  var yValueFromFrame = function(frame) {
    return (-1 * Math.abs(frame*100)+100+padding);
  }
  var wavePath = ["M", padding, yValueFromFrame(frames[0])];
  for (var i = 1; i < frames.length; i++) {
    wavePath.push("L", (i*2)+padding, yValueFromFrame(frames[i]));
  }
  var wave = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  wave.setAttribute("class", "wave");
  wave.setAttribute("d", wavePath.join(" "));
  svgElement.setAttribute("viewBox", "0 0 " + (width+(padding*2)) + " " + (100+labelsPadding+(padding*2)))
  svgElement.appendChild(wave);
  
  // drum sample markers
  
  if (marks && marks.length) {
    for (var i = 0; i < marks.length; i++) {
      var start = marks[i][0];
      var end = marks[i][1];
      var x = ((start / length) * width) + padding;
      var startMarker = document.createElementNS("http://www.w3.org/2000/svg", 'line');
      startMarker.setAttribute("class", "marker");
      startMarker.setAttribute("x1", x);
      startMarker.setAttribute("x2", x);
      startMarker.setAttribute("y1", 112+padding);
      startMarker.setAttribute("y2", 118+padding);
      svgElement.appendChild(startMarker);
    }
  }
  
  // audio player controls
  
  var loadingIndicator = document.createElementNS("http://www.w3.org/2000/svg", 'line');
  loadingIndicator.setAttribute("class", "loading-progress");
  loadingIndicator.setAttribute("x1", padding);
  loadingIndicator.setAttribute("x2", padding+1);
  loadingIndicator.setAttribute("y1", 115+padding);
  loadingIndicator.setAttribute("y2", 115+padding);
  svgElement.appendChild(loadingIndicator);
  
  var positionIndicator = document.createElementNS("http://www.w3.org/2000/svg", 'line');
  positionIndicator.setAttribute("class", "playing-progress");
  positionIndicator.setAttribute("x1", padding);
  positionIndicator.setAttribute("x2", padding+1);
  positionIndicator.setAttribute("y1", 115+padding);
  positionIndicator.setAttribute("y2", 115+padding);
  svgElement.appendChild(positionIndicator);
  
  if ((audioElement.buffered != undefined) && (audioElement.buffered.length != 0)) {
    audioElement.addEventListener('progress', function() {
      var loaded = (audioElement.buffered.end(0) / audioElement.duration) * width;
      loadingIndicator.setAttribute("x2", loaded+padding);
    })
  } else {
    loadingIndicator.setAttribute("x2", width+padding);
  }
  
  audioElement.addEventListener('timeupdate', function() {
    var pos = audioElement.currentTime / audioElement.duration;
    positionIndicator.setAttribute("x2", (pos * width) + padding);
  });
  
  svgElement.addEventListener('click', function() {
    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  });
  
}
