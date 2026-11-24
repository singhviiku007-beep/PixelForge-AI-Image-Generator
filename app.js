const $ = s => document.querySelector(s);
let style = "3D Realistic", size = "1024x1536";
document.querySelectorAll(".style").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".style").forEach(x => x.classList.remove("active"));
  btn.classList.add("active"); style = btn.dataset.style;
}));
document.querySelectorAll(".size").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".size").forEach(x => x.classList.remove("active"));
  btn.classList.add("active"); size = btn.dataset.size;
}));
$("#generate").addEventListener("click", async () => {
  const prompt = $("#prompt").value.trim();
  if (!prompt) { $("#prompt").focus(); $("#status").textContent = "Pehle description likhein."; return; }
  const btn = $("#generate"); btn.disabled = true; btn.innerHTML = "✦ Creating your image..."; 
  $("#status").textContent = "AI image bana raha hai — thoda wait karein";
  $("#canvas").innerHTML = '<div class="placeholder"><div class="spark">✧</div><strong>Creating magic...</strong><span>Aapki image generate ho rahi hai</span></div>';
  $("#download").classList.add("disabled");
  try {
    const res = await fetch("/api/generate", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt,style,size})});
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Generation failed");
    $("#canvas").innerHTML = "";
    const img = document.createElement("img"); img.src = data.image; img.alt = "Generated AI image"; $("#canvas").appendChild(img);
    $("#download").href = data.image; $("#download").classList.remove("disabled");
    $("#status").textContent = "Image ready ✨";
  } catch (err) {
    $("#canvas").innerHTML = '<div class="placeholder"><div class="spark">!</div><strong>Image nahi ban payi</strong><span></span></div>';
    $("#canvas .placeholder span").textContent = err.message;
    $("#status").textContent = "Error";
  } finally { btn.disabled = false; btn.innerHTML = '<span>✦</span> Generate image <b>→</b>'; }
});