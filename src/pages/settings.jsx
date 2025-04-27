import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Monitor, Eye, EyeOff, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config";
import { PageHeader } from "@/components/page-header";
export default function SettingsPage() {
  // —— States & Functions ————————————————————————————————————————————————————
  const { theme, setTheme } = useTheme();
  const [showToken, setShowToken] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gitlabConfig, setGitlabConfig] = useState({
    url: "",
    token: "",
    project_id: "",
  }); // Actual config got from api
  const [tempConfig, setTempConfig] = useState(gitlabConfig); // User Editing

  // —— Fetch initial config ——————————————————————————————————
  useEffect(() => {
    let mounted = true;

    const fetchConfig = async () => {
      try {
        // —— Fetch : Logs ————————————————————————————————————
        console.group("Fetch Gitlab Preferences [Request] ...");
        console.log("Request URL:", `${API_CONFIG.baseUrl}/preferences/gitlab`);
        console.log("Request Method:", "GET");
        console.log("Request Headers:", {
          Accept: "application/json",
        });
        console.groupEnd();

        // —— Fetch : Sending Request —————————————————————————
        const response = await fetch(
          `${API_CONFIG.baseUrl}/preferences/gitlab`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!mounted) return;

        // —— Fetch : Response Logs ——————————————————————————————
        console.group("Fetch Gitlab Preferences [Response] ...");
        console.log("Response Status:", response.status);
        console.log("Response Status Text:", response.statusText);

        // —— Set Response to config —————————————————————————————
        if (response.ok) {
          const responseData = await response.json();
          console.log("Response Data:", responseData);

          const data = responseData.data;
          const config = {
            url: data.url || "",
            token: data.token || "",
            project_id: data.project_id || "",
          };
          console.log("Parsed Config:", config);

          setGitlabConfig(config);
          setTempConfig(config);
        } else {
          console.error("Request Failed:", response.statusText);
        }
      } catch (error) {
        if (mounted) {
          console.group("Fetch Error");
          console.error("Error Type:", error.name);
          console.error("Error Message:", error.message);
          console.error("Stack Trace:", error.stack);
          console.groupEnd();
        }
      } finally {
        console.groupEnd();
      }
    };

    fetchConfig();

    return () => {
      mounted = false;
    };
  }, []);

  const handleGitlabConfigSave = async () => {
    // —— Validation : Logs ———————————————————————————————————
    console.group("GitLab Config Validation");
    console.log("URL:", tempConfig.url);
    console.log("Token:", tempConfig.token ? "Present" : "Missing");
    console.log("Project ID:", tempConfig.project_id);
    console.groupEnd();

    // —— Validate Inputs —————————————————————————————————————
    if (!tempConfig.url || !tempConfig.url.startsWith("http")) {
      console.warn("Validation Failed: Invalid URL");
      toast.warning(
        "Please enter a valid GitLab URL starting with http:// or https://"
      );
      return;
    }
    if (!tempConfig.token) {
      console.warn("Validation Failed: Missing token");
      toast.warning("Access token is required");
      return;
    }
    if (!tempConfig.project_id) {
      console.warn("Validation Failed: Missing project ID");
      toast.warning("Project ID is required");
      return;
    }

    setIsLoading(true);
    try {
      // —— Saving : Logs —————————————————————————————————————
      console.group("Saving GitLab Preferences [Request] ...");
      const requestBody = {
        url: tempConfig.url,
        token: tempConfig.token,
        project_id: tempConfig.project_id,
      };
      console.log("Request URL:", `${API_CONFIG.baseUrl}/preferences/gitlab`);
      console.log("Request Method:", "PUT");
      console.log("Request Headers:", {
        Accept: "application/json",
        "Content-Type": "application/json",
      });
      console.log("Request Body:", requestBody);
      console.groupEnd();

      const response = await fetch(`${API_CONFIG.baseUrl}/preferences/gitlab`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.group("Saving Gitlab Preferences [Response] ...");
      console.log("Response Status:", response.status);
      console.log("Response Status Text:", response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Response Data:", data);

      if (data.status === "success") {
        setGitlabConfig(tempConfig);
        setIsEditing(false);
        toast.success(data.message || "GitLab settings saved successfully");
      } else {
        throw new Error(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.group("Save Error");
      console.error("Error Type:", error.name);
      console.error("Error Message:", error.message);
      console.error("Stack Trace:", error.stack);
      console.groupEnd();

      toast.error(`Failed to save settings: ${error.message}`);
    } finally {
      console.groupEnd();
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempConfig(gitlabConfig);
    setIsEditing(false);
  };

  // —— Render ————————————————————————————————————————————————————————————————
  return (
    <div className="flex flex-col flex-1 w-full">
      <PageHeader
        title="Settings"
        description="Manage your application preferences"
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="rounded-lg border bg-card">
          <div className="border-b bg-muted/50 px-6 py-4">
            <h3 className="text-lg font-medium">Theme</h3>
            <p className="text-sm text-muted-foreground">
              Select your preferred theme for the application
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="shadow-none min-w-[100px] border"
              >
                <Sun className="h-4 w-4 shrink-0" />
                <span>Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="shadow-none min-w-[100px] border"
              >
                <Moon className="h-4 w-4 shrink-0" />
                <span>Dark</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="shadow-none min-w-[100px] border"
              >
                <Monitor className="h-4 w-4 mr-2 shrink-0" />
                <span>System</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b bg-muted/50 px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">GitLab Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Configure your GitLab integration settings
              </p>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="shadow-none border-dashed hover:border-solid transition-all"
              >
                <Pencil className="h-4 w-4 mr-2" />
                <span>Edit Settings</span>
              </Button>
            )}
          </div>
          <div className="p-6 space-y-6">
            <div className="grid gap-4 max-w-lg">
              <div className="space-y-2">
                <Label htmlFor="url">GitLab URL</Label>
                <Input
                  id="url"
                  placeholder="https://gitlab.com"
                  value={isEditing ? tempConfig.url : gitlabConfig.url}
                  onChange={(e) =>
                    setTempConfig((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                  className="shadow-none"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Access Token</Label>
                <div className="relative">
                  <Input
                    id="token"
                    type={showToken ? "text" : "password"}
                    placeholder="glpat-XXXXXXXXXXXXXXXX"
                    value={isEditing ? tempConfig.token : gitlabConfig.token}
                    onChange={(e) =>
                      setTempConfig((prev) => ({
                        ...prev,
                        token: e.target.value,
                      }))
                    }
                    className="shadow-none pr-20"
                    disabled={!isEditing}
                  />
                  {(isEditing || gitlabConfig.token) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-transparent shadow-none"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Create a personal access token with api scope from GitLab
                  settings
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_id">Project ID</Label>
                <Input
                  id="project_id"
                  placeholder="12345678"
                  value={
                    isEditing ? tempConfig.project_id : gitlabConfig.project_id
                  }
                  onChange={(e) =>
                    setTempConfig((prev) => ({
                      ...prev,
                      project_id: e.target.value,
                    }))
                  }
                  className="shadow-none"
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Found in your project's home page
                </p>
              </div>

              {isEditing && (
                <div className="flex items-center gap-2">
                  <Button
                    className="shadow-none"
                    onClick={handleGitlabConfigSave}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    className="shadow-none"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
