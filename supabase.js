const SUPABASE_URL = "https://fdzjnkagnyfmggtjzids.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_kz68JxwwO1vzFafMGe2H8A_pGU5UWOT";

window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

window.betVerse = {
    async requireUser() {
        const { data: { user }, error } = await window.sb.auth.getUser();
        if (error) throw error;
        if (!user) {
            window.location.replace("login.html");
            return null;
        }
        return user;
    },

    async getProfile(userId) {
        const { data, error } = await window.sb
            .from("profiles")
            .select("id, username, email, balance")
            .eq("id", userId)
            .single();
        if (error) throw error;
        return data;
    },

    showError(element, error) {
        element.textContent = error.message || "Something went wrong. Please try again.";
    }
};
