"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  MapPin, 
  Zap, 
  Sparkles, 
  ArrowRight,
  Send,
  Heart,
  Stars,
  ExternalLink,
  Globe,
  Lock,
  Eye,
  CheckCircle2,
  Rocket
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function FeedbackClient() {
  const t = useTranslations("site");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
    type: "feature"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast.success(t("feedback.status.success"), {
        description: t("feedback.status.successDesc")
      });
      setIsSubmitting(false);
      setFormState({ ...formState, message: "" });
    }, 1500);
  };

  const roadmapItems = [
    {
      title: t("feedback.roadmap.items.ai.title"),
      desc: t("feedback.roadmap.items.ai.desc"),
      status: t("feedback.roadmap.status.progress"),
      icon: Sparkles,
      color: "text-blue-500 bg-blue-500/10"
    },
    {
      title: t("feedback.roadmap.items.mobile.title"),
      desc: t("feedback.roadmap.items.mobile.desc"),
      status: t("feedback.roadmap.status.planning"),
      icon: Rocket,
      color: "text-emerald-500 bg-emerald-500/10"
    },
    {
      title: t("feedback.roadmap.items.enterprise.title"),
      desc: t("feedback.roadmap.items.enterprise.desc"),
      status: t("feedback.roadmap.status.done"),
      icon: CheckCircle2,
      color: "text-purple-500 bg-purple-500/10"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* HERO */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)] opacity-30" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("feedback.hero.badge")}</Badge>
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-tight" dangerouslySetInnerHTML={{ __html: t.raw("feedback.hero.title") }} />
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">{t("feedback.hero.subtitle")}</p>
             </motion.div>
          </div>
        </section>

        {/* FEEDBACK FORM & ROADMAP */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                 {/* FORM */}
                 <div className="space-y-12">
                    <div className="space-y-4">
                       <h2 className="text-4xl font-bold font-heading tracking-tight">{t("feedback.form.title")}</h2>
                       <p className="text-muted-foreground font-medium">{t("feedback.form.subtitle")}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">{t("feedback.form.fields.name")}</label>
                             <Input 
                                placeholder="NIKHIL" 
                                className="h-16 rounded-2xl bg-secondary/10 border-border focus:border-primary/50 text-lg font-bold"
                                value={formState.name}
                                onChange={(e) => setFormState({...formState, name: e.target.value})}
                                required
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">{t("feedback.form.fields.email")}</label>
                             <Input 
                                type="email"
                                placeholder="SECURE@SAFEMASTER.IO" 
                                className="h-16 rounded-2xl bg-secondary/10 border-border focus:border-primary/50 text-lg font-bold"
                                value={formState.email}
                                onChange={(e) => setFormState({...formState, email: e.target.value})}
                                required
                             />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">{t("feedback.form.fields.type.label")}</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                             {["feature", "bug", "praise"].map((type) => (
                               <button
                                 key={type}
                                 type="button"
                                 onClick={() => setFormState({...formState, type})}
                                 className={`h-14 rounded-2xl border-2 font-bold tracking-wider text-[10px] transition-all ${
                                   formState.type === type 
                                     ? "border-primary bg-primary/10 text-primary" 
                                     : "border-border bg-secondary/5 text-muted-foreground hover:border-border/80"
                                 }`}
                               >
                                  {t(`feedback.form.fields.type.options.${type}`)}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">{t("feedback.form.fields.message")}</label>
                          <Textarea 
                            placeholder={t("feedback.form.placeholders.message")}
                            className="min-h-[200px] rounded-2xl bg-secondary/10 border-border focus:border-primary/50 p-6 text-lg font-medium"
                            value={formState.message}
                            onChange={(e) => setFormState({...formState, message: e.target.value})}
                            required
                          />
                       </div>

                       <Button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="w-full h-20 rounded-2xl bg-primary hover:bg-primary/90 text-background font-bold tracking-wider text-lg group"
                       >
                          {isSubmitting ? t("feedback.form.button.sending") : t("feedback.form.button.submit")}
                          <Send className={`ml-3 w-6 h-6 transition-transform ${isSubmitting ? "translate-x-10 opacity-0" : "group-hover:translate-x-1 group-hover:-translate-y-1"}`} />
                       </Button>
                    </form>
                 </div>

                 {/* ROADMAP */}
                 <div className="space-y-12">
                    <div className="space-y-4">
                       <h2 className="text-4xl font-bold font-heading tracking-tight">{t("feedback.roadmap.title")}</h2>
                       <p className="text-muted-foreground font-medium">{t("feedback.roadmap.subtitle")}</p>
                    </div>

                    <div className="space-y-6">
                       {roadmapItems.map((item, i) => (
                         <motion.div
                           key={i}
                           initial={{ opacity: 0, x: 20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: i * 0.1 }}
                           className="p-8 rounded-3xl bg-card border border-border/50 shadow-xl group relative overflow-hidden"
                         >
                            <div className="flex items-start gap-6 relative z-10">
                               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                                  <item.icon className="w-8 h-8" />
                               </div>
                               <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                     <h3 className="text-2xl font-bold font-heading">{item.title}</h3>
                                     <Badge variant="outline" className="rounded-full text-[9px] font-semibold uppercase px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                                        {item.status}
                                     </Badge>
                                  </div>
                                  <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                               </div>
                            </div>
                         </motion.div>
                       ))}
                    </div>

                    <div className="p-10 rounded-3xl bg-secondary/20 border border-dashed border-border flex flex-col items-center text-center space-y-6">
                       <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-lg">
                          <Globe className="w-8 h-8 text-primary" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-xl font-bold font-heading">{t("feedback.roadmap.openSource.title")}</h3>
                          <p className="text-sm text-muted-foreground font-medium">{t("feedback.roadmap.openSource.subtitle")}</p>
                       </div>
                       <Button variant="outline" className="h-14 px-8 rounded-2xl border-border hover:bg-background font-bold tracking-wider text-[10px] gap-3">
                          <ExternalLink className="w-4 h-4" /> {t("feedback.roadmap.openSource.button")}
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* FAQ OR STATS */}
        <section className="py-20 border-t border-border">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                 {[
                   { icon: Lock, label: t("feedback.stats.privacy.label"), value: t("feedback.stats.privacy.value") },
                   { icon: Heart, label: t("feedback.stats.community.label"), value: t("feedback.stats.community.value") },
                   { icon: Stars, label: t("feedback.stats.updates.label"), value: t("feedback.stats.updates.value") }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto text-primary">
                         <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-3xl font-bold font-heading">{stat.value}</h4>
                         <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
