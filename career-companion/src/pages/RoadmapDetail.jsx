  import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Style variants with explicit Tailwind classes to avoid dynamic class names
const STYLE_VARIANTS = [
  {
    name: "indigo",
    sectionBg: "bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-gray-900",
    border: "border-indigo-200 dark:border-indigo-700",
    headerText: "text-indigo-700 dark:text-indigo-300",
    chipBg: "bg-indigo-100 dark:bg-indigo-900",
    chipText: "text-indigo-800 dark:text-indigo-200",
    checkboxAccent: "accent-indigo-600",
    ring: "focus:ring-indigo-300/60",
  },
  {
    name: "purple",
    sectionBg: "bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-gray-900",
    border: "border-purple-200 dark:border-purple-700",
    headerText: "text-purple-700 dark:text-purple-300",
    chipBg: "bg-purple-100 dark:bg-purple-900",
    chipText: "text-purple-800 dark:text-purple-200",
    checkboxAccent: "accent-purple-600",
    ring: "focus:ring-purple-300/60",
  },
  {
    name: "emerald",
    sectionBg: "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-gray-900",
    border: "border-emerald-200 dark:border-emerald-700",
    headerText: "text-emerald-700 dark:text-emerald-300",
    chipBg: "bg-emerald-100 dark:bg-emerald-900",
    chipText: "text-emerald-800 dark:text-emerald-200",
    checkboxAccent: "accent-emerald-600",
    ring: "focus:ring-emerald-300/60",
  },
  {
    name: "rose",
    sectionBg: "bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-gray-900",
    border: "border-rose-200 dark:border-rose-700",
    headerText: "text-rose-700 dark:text-rose-300",
    chipBg: "bg-rose-100 dark:bg-rose-900",
    chipText: "text-rose-800 dark:text-rose-200",
    checkboxAccent: "accent-rose-600",
    ring: "focus:ring-rose-300/60",
  },
  {
    name: "amber",
    sectionBg: "bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900",
    border: "border-amber-200 dark:border-amber-700",
    headerText: "text-amber-700 dark:text-amber-300",
    chipBg: "bg-amber-100 dark:bg-amber-900",
    chipText: "text-amber-800 dark:text-amber-200",
    checkboxAccent: "accent-amber-600",
    ring: "focus:ring-amber-300/60",
  },
  {
    name: "sky",
    sectionBg: "bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-gray-900",
    border: "border-sky-200 dark:border-sky-700",
    headerText: "text-sky-700 dark:text-sky-300",
    chipBg: "bg-sky-100 dark:bg-sky-900",
    chipText: "text-sky-800 dark:text-sky-200",
    checkboxAccent: "accent-sky-600",
    ring: "focus:ring-sky-300/60",
  },
];

const getVariant = (index) => STYLE_VARIANTS[index % STYLE_VARIANTS.length];

const Section = ({ index = 0, title, children }) => {
  const variant = getVariant(index);
  return (
    <div className="mb-8 group">
      <h3 className={`text-xl font-semibold ${variant.headerText} mb-2`}>{title}</h3>
      <div
        className={`relative border ${variant.border} rounded-xl p-4 ${variant.sectionBg} transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}
      >
        <div className="absolute -top-2 left-4 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
        {children}
      </div>
    </div>
  );
};

const CheckItem = ({ id, label, checked, onToggle, checkboxAccent = "accent-indigo-600" }) => {
  return (
    <label
      className={`flex items-start gap-3 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800`}
    >
      <input
        type="checkbox"
        className={`mt-1 h-4 w-4 ${checkboxAccent} ${checked ? "" : ""}`}
        checked={!!checked}
        onChange={() => onToggle(id)}
        onClick={(e) => e.stopPropagation()}
      />
      <span className={`text-sm ${checked ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200"}`}>
        {label}
      </span>
    </label>
  );
};

const SkillBadge = ({ id, label, checked, onToggle, variant }) => (
  <button
    onClick={() => onToggle(id)}
    className={`px-3 py-1 rounded-full text-sm ${variant.chipBg} ${variant.chipText} border ${variant.border} transition-all duration-200 hover:shadow hover:-translate-y-0.5 ${checked ? "opacity-70 line-through" : ""}`}
  >
    {label}
  </button>
);

const RoadmapDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [progress, setProgress] = useState({});

  const toggle = async (key) => {
    const current = !!progress[key];
    const nextVal = !current;
    // optimistic update
    setProgress(prev => ({ ...prev, [key]: nextVal }));
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/api/roadmaps/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ key, value: nextVal }),
      });
      if (!res.ok) throw new Error(`Failed to save progress: ${res.status}`);
      const js = await res.json();
      if (js && typeof js === "object" && js.progress) {
        setProgress(js.progress);
      }
    } catch (e) {
      console.error(e);
      // rollback
      setProgress(prev => ({ ...prev, [key]: current }));
    }
  };

  const buildPrintableHTML = () => {
    const safe = (s) => (typeof s === "string" ? s : "");
    const rm = data?.content || {};
    const title = safe(rm.title || data?.title || "Roadmap");

    // Color themes to rotate across sections
    const themes = [
      { bg: "#eef2ff", border: "#c7d2fe", text: "#3730a3", chip: "#e0e7ff" }, // indigo
      { bg: "#f5f3ff", border: "#ddd6fe", text: "#6d28d9", chip: "#ede9fe" }, // purple
      { bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46", chip: "#d1fae5" }, // emerald
      { bg: "#fff1f2", border: "#fecdd3", text: "#9f1239", chip: "#ffe4e6" }, // rose
      { bg: "#fffbeb", border: "#fde68a", text: "#92400e", chip: "#fef3c7" }, // amber
      { bg: "#f0f9ff", border: "#bae6fd", text: "#075985", chip: "#e0f2fe" }, // sky
    ];
    const getTheme = (i) => themes[i % themes.length];

    const isChecked = (key) => !!progress[key];

    let total = 0;
    let done = 0;

    const li = (key, text) => {
      total += 1;
      const checked = isChecked(key);
      if (checked) done += 1;
      const icon = checked ? "✔" : "•";
      const color = checked ? "#059669" : "#6b7280"; // green vs gray
      const deco = checked ? "line-through" : "none";
      return `<li style="margin:8px 0; color:${color};"><span style="display:inline-block; width:1.1em">${icon}</span><span style="color:#111827; text-decoration:${deco}">${safe(text)}</span></li>`;
    };

    const list = (items, prefix) => {
      if (!Array.isArray(items)) return "";
      let out = "<ul style=\"margin:6px 0 12px 18px; padding:0;\">";
      items.forEach((it, idx) => {
        const key = `${prefix}-${idx}`;
        const text = typeof it === "string" ? it : (it?.task || it?.name || JSON.stringify(it));
        out += li(key, text);
      });
      out += "</ul>";
      return out;
    };

    const sectionCardStart = (theme, titleText) => `
      <div style="border:1px solid ${theme.border}; background:${theme.bg}; border-radius:14px; padding:18px 18px; margin:18px 0;">
        <div style="font-weight:800; color:${theme.text}; margin-bottom:10px; font-size:17px;">${safe(titleText)}</div>
    `;
    const sectionCardEnd = () => `</div>`;

    const chip = (theme, text) => `
      <span style="display:inline-block; font-size:12px; padding:8px 12px; margin:6px; border-radius:999px; background:${theme.chip}; color:${theme.text}; border:1px solid ${theme.border}">${safe(text)}</span>
    `;

    const htmlHeader = () => {
      const percent = total === 0 ? 0 : Math.round((done / total) * 100);
      return `
        <div style="border-radius:16px; padding:24px 18px; margin-bottom:18px; color:#fff; background:linear-gradient(90deg,#4f46e5,#8b5cf6,#db2777); background-color:#4f46e5;">
          <div style="font-size:22px; font-weight:800; letter-spacing:0.2px;">${safe(title)}</div>
          ${rm.overview ? `<div style=\"opacity:.95; margin-top:6px; font-size:13.5px; line-height:1.6;\">${safe(rm.overview)}</div>` : ""}
          <div style="height:4px; border-radius:999px; background:#06b6d4; margin-top:14px; margin-bottom:10px;"></div>
          <div style="margin-top:10px;">
            <div style="font-size:12px; opacity:.95; margin-bottom:6px;">Overall Progress: ${done}/${total} (${percent}%)</div>
            <div style="height:10px; background:#ffffff26; border-radius:999px; overflow:hidden;">
              <div style="height:100%; width:${percent}%; background:#10b981; border-radius:999px;"></div>
            </div>
          </div>
        </div>
      `;
    };

    let html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        @page { margin: 8mm; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; padding: 0; color: #111827; background:#f8fafc; }
        a, a:visited { color: #06b6d4; text-decoration: underline; }
        h2 { font-size: 18px; margin: 16px 0 10px; }
        h3 { font-size: 15px; margin: 12px 0 8px; }
        .muted { color: #6b7280; }
        .subtle { color:#444; font-size:13.5px; line-height: 1.6; }
        .weekCard { border:1px solid #e5e7eb; background:#ffffff; border-radius:12px; padding:14px 14px; margin:12px 0; }
      </style>
    </head><body>`;

    // We first scan to count total items for progress header
    // prerequisites
    if (Array.isArray(rm.prerequisites)) rm.prerequisites.forEach((_, i) => { total++; if (isChecked(`prereq-${i}`)) done++; });
    // skills
    if (Array.isArray(rm.skills_to_master)) rm.skills_to_master.forEach((_, i) => { total++; if (isChecked(`skill-${i}`)) done++; });
    // phases
    if (Array.isArray(rm.phases)) {
      rm.phases.forEach((ph, pidx) => {
        if (Array.isArray(ph.weeks)) ph.weeks.forEach((w, widx) => {
          if (Array.isArray(w.topics)) w.topics.forEach((_, i) => { total++; if (isChecked(`phase-${pidx}-week-${widx}-topic-${i}`)) done++; });
          if (Array.isArray(w.resources)) w.resources.forEach((_, i) => { total++; if (isChecked(`phase-${pidx}-week-${widx}-res-${i}`)) done++; });
          if (Array.isArray(w.hands_on)) w.hands_on.forEach((_, i) => { total++; if (isChecked(`phase-${pidx}-week-${widx}-ho-${i}`)) done++; });
        });
      });
    }
    // projects deliverables
    if (Array.isArray(rm.projects)) rm.projects.forEach((pr, i) => { if (Array.isArray(pr.deliverables)) pr.deliverables.forEach((_, di) => { total++; if (isChecked(`project-${i}-deliv-${di}`)) done++; }); });
    // interview prep
    if (rm.interview_prep) {
      if (Array.isArray(rm.interview_prep.topics)) rm.interview_prep.topics.forEach((_, i) => { total++; if (isChecked(`ip-topic-${i}`)) done++; });
      if (Array.isArray(rm.interview_prep.resources)) rm.interview_prep.resources.forEach((_, i) => { total++; if (isChecked(`ip-res-${i}`)) done++; });
    }
    // next steps
    if (Array.isArray(rm.next_steps)) rm.next_steps.forEach((_, i) => { total++; if (isChecked(`next-${i}`)) done++; });
    // outcomes
    if (Array.isArray(rm.estimated_outcomes)) rm.estimated_outcomes.forEach((_, i) => { total++; if (isChecked(`outcome-${i}`)) done++; });

    html += htmlHeader();
    html += `<div style="border:1px solid #e5e7eb; border-radius:16px; padding:16px 14px; background:#ffffff;">`;

    if (rm.duration_weeks) {
      const th = getTheme(0);
      html += sectionCardStart(th, "Duration") + `<div class="subtle">${rm.duration_weeks} weeks</div>` + sectionCardEnd();
    }

    if (Array.isArray(rm.prerequisites) && rm.prerequisites.length) {
      const th = getTheme(1);
      html += sectionCardStart(th, "Prerequisites");
      html += list(rm.prerequisites, 'prereq');
      html += sectionCardEnd();
    }

    if (Array.isArray(rm.skills_to_master) && rm.skills_to_master.length) {
      const th = getTheme(2);
      html += sectionCardStart(th, "Skills to Master");
      html += `<div>` + rm.skills_to_master.map((s, i) => chip(th, s)).join("") + `</div>`;
      html += sectionCardEnd();
    }

    if (Array.isArray(rm.phases) && rm.phases.length) {
      const baseTh = getTheme(3);
      html += sectionCardStart(baseTh, "Phases & Weeks");
      rm.phases.forEach((ph, pidx) => {
        const phTh = getTheme(3 + pidx);
        html += `<div style="margin:10px 0 8px; font-weight:700; color:${phTh.text};">${safe(ph.name)}</div>`;
        if (Array.isArray(ph.weeks)) {
          ph.weeks.forEach((w, widx) => {
            html += `<div class="weekCard"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px"><div style="font-weight:600">Week ${w.week}</div><div class="subtle">${safe(w.focus || "")}</div></div>`;
            if (Array.isArray(w.topics)) {
              html += `<div style="font-weight:600; margin-top:6px;">Topics</div>`;
              w.topics.forEach((t, i) => { html += li(`phase-${pidx}-week-${widx}-topic-${i}`, t); });
            }
            if (Array.isArray(w.resources)) {
              html += `<div style="font-weight:600; margin-top:6px;">Resources</div>`;
              w.resources.forEach((r, i) => {
                const key = `phase-${pidx}-week-${widx}-res-${i}`;
                const checked = isChecked(key);
                const icon = checked ? "✔" : "•";
                const color = checked ? "#059669" : "#6b7280";
                html += `<div style=\"margin:6px 0; color:${color};\"><span style=\"display:inline-block; width:1.1em\">${icon}</span><a href=\"${r.url}\" style=\"color:#06b6d4; text-decoration: underline;\">${safe(r.name)}</a></div>`;
              });
            }
            if (Array.isArray(w.hands_on)) {
              html += `<div style="font-weight:600; margin-top:6px;">Hands-on</div>`;
              w.hands_on.forEach((h, i) => { html += li(`phase-${pidx}-week-${widx}-ho-${i}`, `${h.task}${h.est_hours ? ` (~${h.est_hours}h)` : ''}`); });
            }
            if (w.milestone) html += `<div class="subtle" style="margin-top:6px;"><strong>Milestone:</strong> ${safe(w.milestone)}</div>`;
            if (w.assessment) html += `<div class="subtle" style="margin-top:4px;"><strong>Assessment:</strong> ${safe(w.assessment)}</div>`;
            html += `</div>`; // weekCard
          });
        }
      });
      html += sectionCardEnd();
    }

    if (Array.isArray(rm.projects) && rm.projects.length) {
      const th = getTheme(4);
      html += sectionCardStart(th, "Projects");
      rm.projects.forEach((pr, i) => {
        html += `<div style="border:1px dashed ${th.border}; border-radius:10px; padding:10px 12px; margin:8px 0; background:#fff;">
          <div style="font-weight:600; margin-bottom:2px; color:${th.text}">${safe(pr.name)}</div>
          ${pr.description ? `<div class=\"subtle\">${safe(pr.description)}</div>` : ""}
        `;
        if (Array.isArray(pr.deliverables)) {
          pr.deliverables.forEach((d, di) => { html += li(`project-${i}-deliv-${di}`, d); });
        }
        html += `</div>`;
      });
      html += sectionCardEnd();
    }

    if (rm.interview_prep) {
      const th = getTheme(5);
      html += sectionCardStart(th, "Interview Prep");
      if (Array.isArray(rm.interview_prep.topics)) {
        html += `<div style="font-weight:600; margin-top:2px;">Topics</div>`;
        rm.interview_prep.topics.forEach((t, i) => { html += li(`ip-topic-${i}`, t); });
      }
      if (Array.isArray(rm.interview_prep.resources)) {
        html += `<div style="font-weight:600; margin-top:8px;">Resources</div>`;
        rm.interview_prep.resources.forEach((r, i) => {
          const key = `ip-res-${i}`;
          const checked = isChecked(key);
          const icon = checked ? "✔" : "•";
          const color = checked ? "#059669" : "#6b7280";
          html += `<div style=\"margin:6px 0; color:${color};\"><span style=\"display:inline-block; width:1.1em\">${icon}</span><a href=\"${r.url}\" style=\"color:#06b6d4; text-decoration: underline;\">${safe(r.name)}</a></div>`;
        });
      }
      html += sectionCardEnd();
    }

    if (Array.isArray(rm.next_steps) && rm.next_steps.length) {
      const th = getTheme(0);
      html += sectionCardStart(th, "Next Steps");
      rm.next_steps.forEach((n, i) => { html += li(`next-${i}`, n); });
      html += sectionCardEnd();
    }

    if (Array.isArray(rm.estimated_outcomes) && rm.estimated_outcomes.length) {
      const th = getTheme(1);
      html += sectionCardStart(th, "Estimated Outcomes");
      rm.estimated_outcomes.forEach((o, i) => { html += li(`outcome-${i}`, o); });
      html += sectionCardEnd();
    }

    html += `</div>`;
    html += `</body></html>`;
    return html;
  };

  const handleDownloadPDF = () => {
    try {
      const html = buildPrintableHTML();
      const w = window.open("", "_blank");
      if (!w) return;
      w.document.open();
      w.document.write(html);
      w.document.close();
      w.document.title = (data?.content?.title || data?.title || 'roadmap') + ' - Roadmap';
      w.focus();
      setTimeout(() => {
        w.print();
      }, 300);
    } catch (e) {
      console.error("PDF export failed", e);
    }
  };

  const handleDownloadWord = () => {
    try {
      const html = buildPrintableHTML();
      const blob = new Blob(["\uFEFF" + html], { type: "application/vnd.ms-word" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fname = (data?.content?.title || data?.title || 'roadmap').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.doc';
      a.href = url;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Word export failed", e);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`http://localhost:8000/api/roadmaps/${id}/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const json = await res.json();
        setData(json);
        const serverProgress = (json && json.content && typeof json.content === "object") ? (json.content.progress || {}) : {};
        if (serverProgress && typeof serverProgress === "object") {
          setProgress(serverProgress);
        } else {
          setProgress({});
        }
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load roadmap");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400">{error}</div>
    );
  }
  if (!data) return null;

  const roadmap = data.content || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 mb-2">
              {roadmap.title || data.title}
            </h1>
            {roadmap.overview && (
              <p className="text-gray-700 dark:text-gray-300 max-w-3xl">{roadmap.overview}</p>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-900/60 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            Progress is synced to your account
          </div>
        </div>

        {roadmap.duration_weeks && (
          <Section index={0} title="Duration">
            <p className="text-gray-800 dark:text-gray-200 font-medium">{roadmap.duration_weeks} weeks</p>
          </Section>
        )}

        {Array.isArray(roadmap.prerequisites) && roadmap.prerequisites.length > 0 && (
          <Section index={1} title="Prerequisites">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roadmap.prerequisites.map((p, i) => (
                <CheckItem
                  key={`prereq-${i}`}
                  id={`prereq-${i}`}
                  label={p}
                  checked={progress[`prereq-${i}`]}
                  onToggle={toggle}
                  checkboxAccent={getVariant(1).checkboxAccent}
                />
              ))}
            </div>
          </Section>
        )}

        {Array.isArray(roadmap.skills_to_master) && roadmap.skills_to_master.length > 0 && (
          <Section index={2} title="Skills to Master">
            <div className="flex flex-wrap gap-2">
              {roadmap.skills_to_master.map((s, i) => (
                <SkillBadge
                  key={`skill-${i}`}
                  id={`skill-${i}`}
                  label={s}
                  checked={progress[`skill-${i}`]}
                  onToggle={toggle}
                  variant={getVariant(2)}
                />
              ))}
            </div>
          </Section>
        )}

        {Array.isArray(roadmap.phases) && roadmap.phases.length > 0 && (
          <Section index={3} title="Phases & Weeks">
            <div className="space-y-6">
              {roadmap.phases.map((ph, pidx) => {
                const variant = getVariant(3 + pidx);
                return (
                  <div key={pidx} className="">
                    <h4 className={`text-lg font-semibold mb-2 ${variant.headerText}`}>{ph.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.isArray(ph.weeks) && ph.weeks.map((w, widx) => (
                        <div
                          key={widx}
                          className={`border ${variant.border} rounded-xl p-3 bg-white/70 dark:bg-gray-900/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Week {w.week}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{w.focus}</span>
                          </div>

                          {Array.isArray(w.topics) && (
                            <div className="mb-3">
                              <div className="text-sm font-medium mb-1">Topics</div>
                              <div className="space-y-2">
                                {w.topics.map((t, i) => (
                                  <CheckItem
                                    key={`phase-${pidx}-week-${widx}-topic-${i}`}
                                    id={`phase-${pidx}-week-${widx}-topic-${i}`}
                                    label={t}
                                    checked={progress[`phase-${pidx}-week-${widx}-topic-${i}`]}
                                    onToggle={toggle}
                                    checkboxAccent={variant.checkboxAccent}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {Array.isArray(w.resources) && (
                            <div className="mb-3">
                              <div className="text-sm font-medium mb-1">Resources</div>
                              <div className="space-y-2">
                                {w.resources.map((r, i) => (
                                  <div key={`phase-${pidx}-week-${widx}-res-${i}`} className="flex items-center gap-2">
                                    <CheckItem
                                      id={`phase-${pidx}-week-${widx}-res-${i}`}
                                      label={
                                        <span className="text-sm">
                                          <a href={r.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{r.name}</a>
                                        </span>
                                      }
                                      checked={progress[`phase-${pidx}-week-${widx}-res-${i}`]}
                                      onToggle={toggle}
                                      checkboxAccent={variant.checkboxAccent}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {Array.isArray(w.hands_on) && (
                            <div className="mb-2">
                              <div className="text-sm font-medium mb-1">Hands-on</div>
                              <div className="space-y-2">
                                {w.hands_on.map((h, i) => (
                                  <CheckItem
                                    key={`phase-${pidx}-week-${widx}-ho-${i}`}
                                    id={`phase-${pidx}-week-${widx}-ho-${i}`}
                                    label={`${h.task}${h.est_hours ? ` (~${h.est_hours}h)` : ""}`}
                                    checked={progress[`phase-${pidx}-week-${widx}-ho-${i}`]}
                                    onToggle={toggle}
                                    checkboxAccent={variant.checkboxAccent}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {w.milestone && (
                            <div className="text-sm mt-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <span className="font-medium">Milestone:</span> {w.milestone}
                            </div>
                          )}
                          {w.assessment && (
                            <div className="text-sm mt-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <span className="font-medium">Assessment:</span> {w.assessment}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {Array.isArray(roadmap.projects) && roadmap.projects.length > 0 && (
          <Section index={4} title="Projects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmap.projects.map((pr, i) => {
                const variant = getVariant(4);
                return (
                  <div
                    key={i}
                    className={`border ${variant.border} rounded-xl p-4 bg-white/70 dark:bg-gray-900/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
                  >
                    <div className="font-semibold mb-1">{pr.name}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pr.description}</div>
                    {Array.isArray(pr.deliverables) && (
                      <div className="space-y-2">
                        {pr.deliverables.map((d, di) => (
                          <CheckItem
                            key={`project-${i}-deliv-${di}`}
                            id={`project-${i}-deliv-${di}`}
                            label={d}
                            checked={progress[`project-${i}-deliv-${di}`]}
                            onToggle={toggle}
                            checkboxAccent={variant.checkboxAccent}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {roadmap.interview_prep && (
          <Section index={5} title="Interview Prep">
            <div className="text-gray-700 dark:text-gray-300">
              {Array.isArray(roadmap.interview_prep.topics) && (
                <div className="mb-3">
                  <div className="font-medium mb-1">Topics</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {roadmap.interview_prep.topics.map((t, i) => (
                      <CheckItem
                        key={`ip-topic-${i}`}
                        id={`ip-topic-${i}`}
                        label={t}
                        checked={progress[`ip-topic-${i}`]}
                        onToggle={toggle}
                        checkboxAccent={getVariant(5).checkboxAccent}
                      />
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(roadmap.interview_prep.resources) && (
                <div>
                  <div className="font-medium mb-1">Resources</div>
                  <div className="space-y-2">
                    {roadmap.interview_prep.resources.map((r, i) => (
                      <CheckItem
                        key={`ip-res-${i}`}
                        id={`ip-res-${i}`}
                        label={<a href={r.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{r.name}</a>}
                        checked={progress[`ip-res-${i}`]}
                        onToggle={toggle}
                        checkboxAccent={getVariant(5).checkboxAccent}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {Array.isArray(roadmap.next_steps) && roadmap.next_steps.length > 0 && (
          <Section index={6} title="Next Steps">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roadmap.next_steps.map((n, i) => (
                <CheckItem
                  key={`next-${i}`}
                  id={`next-${i}`}
                  label={n}
                  checked={progress[`next-${i}`]}
                  onToggle={toggle}
                  checkboxAccent={getVariant(6).checkboxAccent}
                />
              ))}
            </div>
          </Section>
        )}

        {Array.isArray(roadmap.estimated_outcomes) && roadmap.estimated_outcomes.length > 0 && (
          <Section index={0} title="Estimated Outcomes">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roadmap.estimated_outcomes.map((o, i) => (
                <CheckItem
                  key={`outcome-${i}`}
                  id={`outcome-${i}`}
                  label={o}
                  checked={progress[`outcome-${i}`]}
                  onToggle={toggle}
                  checkboxAccent={getVariant(0).checkboxAccent}
                />
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Floating Download Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {menuOpen && (
            <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 w-44 transition-all">
              <button
                onClick={() => { setMenuOpen(false); handleDownloadPDF(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-rose-600">
                  <path d="M12 16l4-5h-3V4h-2v7H8l4 5z"/><path d="M20 18H4v2h16v-2z"/>
                </svg>
                <span className="text-sm">Download PDF</span>
              </button>
              <button
                onClick={() => { setMenuOpen(false); handleDownloadWord(); }}
                className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-sky-600">
                  <path d="M4 4h16v16H4z" fill="none"/><path d="M7 7h2l1.5 6L12 9h2l1.5 4 1.5-6h2l-2.5 10h-2L12 11l-1.5 6h-2L6 7z"/>
                </svg>
                <span className="text-sm">Download Word</span>
              </button>
            </div>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Download"
            className="group inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-300/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 16l4-5h-3V4h-2v7H8l4 5z"/><path d="M20 18H4v2h16v-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;
