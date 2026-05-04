import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Divider,
} from "@mui/material";
import { motion, useInView, useAnimation } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   Each section has its own entrance — nothing feels the same
───────────────────────────────────────────────────────────── */

// Outer card slides up + fades in
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// Container that staggers its children
const staggerContainer = (delayStart = 0) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delayStart,
      staggerChildren: 0.09,
    },
  },
});

// Standard fade + rise (used for most blocks)
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// Slide in from left (header label, section labels)
const slideRight = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

// Scale up from center (confidence badge)
const scalePop = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }, // slight spring
  },
};

// Prediction text — dramatic fade + slight scale
const predictionReveal = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
  },
};

// Progress bar width animates from 0
const barReveal = (delay = 0) => ({
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
  },
});

// Grid section cards pop in
const gridItem = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Footer slides up last
const footerReveal = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
  },
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

const M = {
  div: motion.div,
  span: motion.span,
};

function getConfidenceMeta(prob) {
  const pct = Math.round(prob * 100);
  if (pct >= 70) return { label: "High confidence", color: "#4fd1c5" };
  if (pct >= 40) return { label: "Moderate", color: "#63b3ed" };
  return { label: "Low confidence", color: "#8892a4" };
}

const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontSize: "10.5px",
      fontWeight: 600,
      letterSpacing: "1.1px",
      textTransform: "uppercase",
      color: "#4a5368",
      mb: 1.2,
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    {children}
  </Typography>
);

/* ── Animated bar component ────────────────────────────────── */
function AnimatedBar({ pct, isTop, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <Box ref={ref}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0.8,
        }}
      >
        <M.div
          variants={slideRight}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <Typography
            sx={{
              fontSize: "13.5px",
              fontWeight: isTop ? 500 : 400,
              color: isTop ? "#e8eaf0" : "#8892a4",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {/* passed via parent */}
          </Typography>
        </M.div>
      </Box>

      {/* Track */}
      <Box
        sx={{
          height: isTop ? 5 : 3,
          borderRadius: 10,
          backgroundColor: "rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Fill — framer-motion scaleX from originX:0 */}
        <motion.div
          variants={barReveal(delay)}
          initial="hidden"
          animate={controls}
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 10,
            background: isTop
              ? "linear-gradient(90deg, #3b82f6, #06b6d4)"
              : "rgba(255,255,255,0.12)",
            transformOrigin: "left center",
          }}
        />
      </Box>
    </Box>
  );
}

/* ── Section box with hover ────────────────────────────────── */
function Section({ title, children }) {
  return (
    <motion.div
      variants={gridItem}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "16px",
        cursor: "default",
      }}
    >
      <SectionLabel>{title}</SectionLabel>
      <Typography
        sx={{
          fontSize: "13.5px",
          color: "#c8cdd8",
          lineHeight: 1.7,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {children || "No data available"}
      </Typography>
    </motion.div>
  );
}

/* ── List section box with hover ───────────────────────────── */
function ListSection({ title, items }) {
  return (
    <motion.div
      variants={gridItem}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "16px",
        cursor: "default",
      }}
    >
      <SectionLabel>{title}</SectionLabel>
      {items?.length ? (
        <motion.div
          variants={staggerContainer(0.05)}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", flexDirection: "column", gap: "6px" }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}
            >
              <Box
                sx={{
                  mt: "7px",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#63b3ed",
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: "13.5px",
                  color: "#c8cdd8",
                  lineHeight: 1.65,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {item}
              </Typography>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Typography
          sx={{
            fontSize: "13px",
            color: "#4a5368",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          No data available
        </Typography>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN REPORT CARD
───────────────────────────────────────────────────────────── */
export default function ReportCard({ data }) {
  if (!data) return null;

  const topPrediction = data.top3?.[0];
  const confidenceMeta = topPrediction
    ? getConfidenceMeta(topPrediction.probability)
    : null;

  return (
    /* 1. Entire card slides up on mount */
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{ width: "100%", maxWidth: 740 }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: "22px",
          background:
            "linear-gradient(160deg, rgba(18,21,36,0.97) 0%, rgba(12,14,24,0.99) 100%)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: `
            0 1px 0 0 rgba(255,255,255,0.06) inset,
            0 32px 80px rgba(0,0,0,0.75),
            0 8px 32px rgba(0,0,0,0.5)
          `,
        }}
      >
        <CardContent sx={{ p: "36px !important" }}>
          {/* 2. Everything inside staggers from top → bottom */}
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            animate="visible"
          >
            {/* ── HEADER ── */}
            <motion.div variants={fadeUp}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 4,
                }}
              >
                <Box>
                  <motion.div variants={slideRight}>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        color: "#3b82f6",
                        mb: 1,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Health Report
                    </Typography>
                  </motion.div>

                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 600,
                      letterSpacing: "-0.5px",
                      color: "#e8eaf0",
                      lineHeight: 1.2,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {data.name || "Patient"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#5c6880",
                      mt: 0.5,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {data.age && `${data.age} years`}
                    {data.age && data.gender && " · "}
                    {data.gender}
                  </Typography>
                </Box>

                {/* Confidence badge — scale pop */}
                {confidenceMeta && (
                  <motion.div variants={scalePop}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        background: `${confidenceMeta.color}12`,
                        border: `1px solid ${confidenceMeta.color}28`,
                        borderRadius: "100px",
                        px: 1.8,
                        py: 0.7,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: confidenceMeta.color,
                          boxShadow: `0 0 8px ${confidenceMeta.color}`,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: confidenceMeta.color,
                          letterSpacing: "0.4px",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {confidenceMeta.label}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </Box>
            </motion.div>

            {/* ── PREDICTION BLOCK ── */}
            <motion.div variants={fadeUp}>
              <Box
                sx={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                  p: 3,
                  mb: 3.5,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Left accent bar — slides in from left */}
                <motion.div
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.35,
                  }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "3px",
                    borderRadius: "16px 0 0 16px",
                    background: "linear-gradient(180deg, #3b82f6, #06b6d4)",
                    transformOrigin: "top center",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "10.5px",
                    fontWeight: 600,
                    letterSpacing: "1.1px",
                    textTransform: "uppercase",
                    color: "#4a5368",
                    mb: 1,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Most Likely Condition
                </Typography>

                {/* Disease name — dramatic reveal */}
                <motion.div variants={predictionReveal}>
                  <Typography
                    sx={{
                      fontSize: "30px",
                      fontWeight: 600,
                      letterSpacing: "-0.8px",
                      color: "#e8eaf0",
                      lineHeight: 1.15,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {data.prediction}
                  </Typography>
                </motion.div>
              </Box>
            </motion.div>

            {/* ── PROBABILITY BARS ── */}
            {data.top3?.length > 0 && (
              <motion.div variants={fadeUp}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontSize: "10.5px",
                      fontWeight: 600,
                      letterSpacing: "1.1px",
                      textTransform: "uppercase",
                      color: "#4a5368",
                      mb: 1.5,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Differential Diagnosis
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {data.top3.map((item, i) => {
                      const pct = Math.round(item.probability * 100);
                      const isTop = i === 0;
                      return (
                        <Box key={i}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 0.8,
                            }}
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.35,
                                delay: 0.4 + i * 0.08,
                                ease: "easeOut",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "13.5px",
                                  fontWeight: isTop ? 500 : 400,
                                  color: isTop ? "#e8eaf0" : "#8892a4",
                                  fontFamily: "'DM Sans', sans-serif",
                                }}
                              >
                                {item.disease}
                              </Typography>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.55 + i * 0.08,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  color: isTop ? "#63b3ed" : "#4a5368",
                                  fontFamily: "'DM Mono', monospace",
                                  letterSpacing: "0.3px",
                                }}
                              >
                                {pct}%
                              </Typography>
                            </motion.div>
                          </Box>

                          {/* Animated bar track */}
                          <Box
                            sx={{
                              height: isTop ? 5 : 3,
                              borderRadius: 10,
                              backgroundColor: "rgba(255,255,255,0.05)",
                              overflow: "hidden",
                            }}
                          >
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{
                                duration: 0.8,
                                delay: 0.5 + i * 0.12,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                borderRadius: 10,
                                background: isTop
                                  ? "linear-gradient(90deg, #3b82f6, #06b6d4)"
                                  : "rgba(255,255,255,0.12)",
                                transformOrigin: "left center",
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* ── DIVIDER ── */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scaleX: 0.6 },
                visible: {
                  opacity: 1,
                  scaleX: 1,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              <Divider
                sx={{ borderColor: "rgba(255,255,255,0.05)", mb: 3.5 }}
              />
            </motion.div>

            {/* ── DETAIL GRID — each box staggers in ── */}
            <motion.div
              variants={staggerContainer(0)}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "12px",
              }}
            >
              <Section title="Description">{data.details?.description}</Section>
              <ListSection
                title="Precautions"
                items={data.details?.precautions}
              />
              <ListSection
                title="Medications"
                items={data.details?.medications}
              />
              <ListSection title="Diet" items={data.details?.diet} />
            </motion.div>

            {/* ── FOOTER ── */}
            <motion.div variants={footerReveal}>
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(246,173,85,0.08)",
                    border: "1px solid rgba(246,173,85,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  ⚠
                </Box>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#4a5368",
                    lineHeight: 1.6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  This is an AI-generated report and does not constitute a
                  medical diagnosis. Always consult a qualified healthcare
                  professional.
                </Typography>
              </Box>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
