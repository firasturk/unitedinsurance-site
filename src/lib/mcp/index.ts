import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listArticles from "./tools/list-articles";
import getArticle from "./tools/get-article";
import createArticle from "./tools/create-article";
import updateArticle from "./tools/update-article";
import listInsuranceServices from "./tools/list-insurance-services";
import listTeamMembers from "./tools/list-team-members";
import listForms from "./tools/list-forms";

// The OAuth issuer must be the direct Supabase host; the project ref is inlined at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "secure-future-hub",
  title: "Secure Future Hub",
  version: "0.1.0",
  instructions:
    "Tools for the United Insurance (Secure Future Hub) website. Read and manage news articles, insurance services, team members, and downloadable forms. Write tools require the signed-in user to have admin rights on the site.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listArticles,
    getArticle,
    createArticle,
    updateArticle,
    listInsuranceServices,
    listTeamMembers,
    listForms,
  ],
});
