import { useEffect } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft, ArrowRight, Cancel } from "@hugeicons/core-free-icons";
import { RichText } from "./RichText.jsx";

// Accetta link YouTube normali, youtu.be o già /embed/
function toEmbedUrl(url) {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1` : url;
}

function Meta({ label, value, list = false }) {
  if (!value) return null;
  return (
    <div>
      <div className="label uppercase text-muted-foreground mb-1.5">{label}</div>
      {list?
        value.map((item, index) => (
          <div key={index} className="text-sm text-primary">{item}</div>
        )) : <div className="text-sm text-primary">{value}</div>}      
    </div>
  );
}

export default function ProjectModal({ project, allProjects, onClose, onNavigate }) {
  const { title, date, role, teamsize, duration, tags = [], images = [], videos = [], descriptionEng = [] } = project;

  const currentIndex = allProjects.findIndex((p) => p.title === title);
  const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const next = currentIndex >= 0 ? allProjects[currentIndex + 1] ?? null : null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-100 bg-background overflow-y-auto"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Barra sticky */}
      <div className="sticky top-0 z-10 bg-background/85 backdrop-blur border-b border-border">
        <div className="px-(--gutter) h-14 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 label uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <HugeiconsIcon icon={ArrowLeft} size={14} />
            Back to Portfolio
          </button>
          <button onClick={onClose} aria-label="Close project" className="p-2 text-muted-foreground hover:text-foreground cursor-pointer">
            <HugeiconsIcon icon={Cancel} size={16} />
          </button>
        </div>
      </div>

      <div className="px-(--gutter) py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="label uppercase text-muted-foreground">{date}</span>
          <h1 className="font-medium tracking-tight leading-[1.05] my-6" style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
            {title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-5">
            {tags.map((t) => (
              <span key={t} className="label uppercase p-1 border border-border text-muted-foreground">{t}</span>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-5 md:justify-between border-t border-border pt-6 mt-6 ">
            <Meta label="Role" value={role} list={true} />
            <Meta label="Team size" value={teamsize} />
            <Meta label="Duration" value={duration} />
          </div>
        </div>

        {/* Case study */}
        <div className="space-y-10 mb-16">
          {descriptionEng.map((section) => (
            <div key={section.heading} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-x-10 gap-y-3 border-t border-border pt-8">
              <div className="text-primary pt-0.5">{section.heading}</div>
              <div className="min-w-0"><RichText>{section.body}</RichText></div>
            </div>
          ))}
        </div>

        {/* Galleria */}
        {images.length > 0 && (
          <div className="mb-16">
            <div className="label uppercase text-muted-foreground mb-6">Gallery</div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {images.map((src, i) => (
                <div key={i} className="bg-muted overflow-hidden aspect-4/3">
                  <img src={src} alt={`${title} — image ${i + 2}`} loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video: salta quelli senza url */}
        {videos.filter((v) => v.url).map((v) => (
          <div key={v.heading} className="mb-16">
            <div className="label uppercase text-muted-foreground mb-6">{v.heading}</div>
            <div className="aspect-video bg-muted">
              <iframe
                src={toEmbedUrl(v.url)}
                title={`${title} — ${v.heading}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ))}

        {/* Prev / Next */}
        <div className="border-t border-border pt-10 flex items-stretch justify-between gap-4">
          {prev ? (
            <button onClick={() => onNavigate(prev)} className="group flex items-center gap-3 text-left hover:text-accent transition-colors cursor-pointer">
              <HugeiconsIcon icon={ArrowLeft} size={16} className="text-muted-foreground group-hover:text-accent shrink-0" />
              <div>
                <div className="label uppercase text-muted-foreground mb-1">Previous</div>
                <div className="text-lg text-primary font-sans font-medium leading-tight">{prev.title}</div>
              </div>
            </button>
          ) : <div />}
          {next ? (
            <button onClick={() => onNavigate(next)} className="group flex items-center gap-3 text-right hover:text-accent transition-colors ml-auto cursor-pointer">
              <div>
                <div className="label uppercase text-muted-foreground mb-1">Next</div>
                <div className="text-lg text-primary font-sans font-medium leading-tight">{next.title}</div>
              </div>
              <HugeiconsIcon icon={ArrowRight} size={16} className="text-muted-foreground group-hover:text-accent shrink-0" />
            </button>
          ) : <div />}
        </div>
      </div>
    </motion.div>
  );
}