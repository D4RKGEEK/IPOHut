import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { FooterLink, FooterSection } from "@/types/admin";

export function FooterSettings() {
  const { settings, updateSiteSettings } = useAdmin();
  const footer = settings.site.footer;

  const updateFooter = (updates: Partial<typeof footer>) => {
    updateSiteSettings({
      footer: { ...footer, ...updates },
    });
  };

  // Custom links management
  const addCustomLink = () => {
    const newLink: FooterLink = {
      id: crypto.randomUUID(),
      label: "",
      url: "",
    };
    updateFooter({
      customLinks: [...footer.customLinks, newLink],
    });
  };

  const updateCustomLink = (id: string, field: 'label' | 'url', value: string) => {
    updateFooter({
      customLinks: footer.customLinks.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    });
  };

  const removeCustomLink = (id: string) => {
    updateFooter({
      customLinks: footer.customLinks.filter(link => link.id !== id),
    });
  };

  // Section management
  const addSection = () => {
    const newSection: FooterSection = {
      id: crypto.randomUUID(),
      title: "New Section",
      visible: true,
      links: [],
    };
    updateFooter({
      sections: [...footer.sections, newSection],
    });
  };

  const updateSection = (id: string, updates: Partial<FooterSection>) => {
    updateFooter({
      sections: footer.sections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      ),
    });
  };

  const removeSection = (id: string) => {
    updateFooter({
      sections: footer.sections.filter(section => section.id !== id),
    });
  };

  const addLinkToSection = (sectionId: string) => {
    const newLink: FooterLink = {
      id: crypto.randomUUID(),
      label: "",
      url: "",
    };
    updateFooter({
      sections: footer.sections.map(section =>
        section.id === sectionId
          ? { ...section, links: [...section.links, newLink] }
          : section
      ),
    });
  };

  const updateSectionLink = (sectionId: string, linkId: string, field: 'label' | 'url', value: string) => {
    updateFooter({
      sections: footer.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.map(link =>
                link.id === linkId ? { ...link, [field]: value } : link
              ),
            }
          : section
      ),
    });
  };

  const removeSectionLink = (sectionId: string, linkId: string) => {
    updateFooter({
      sections: footer.sections.map(section =>
        section.id === sectionId
          ? { ...section, links: section.links.filter(link => link.id !== linkId) }
          : section
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Copyright & Disclaimer */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Content</CardTitle>
          <CardDescription>Customize copyright text and disclaimer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copyrightText">Copyright Text</Label>
            <Input 
              id="copyrightText"
              value={footer.copyrightText} 
              onChange={e => updateFooter({ copyrightText: e.target.value })} 
              placeholder="© {year} {siteName}. All rights reserved."
            />
            <p className="text-xs text-muted-foreground">
              Use {"{year}"} for current year and {"{siteName}"} for site name
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="disclaimer">Disclaimer</Label>
            <Textarea 
              id="disclaimer"
              rows={3}
              value={footer.disclaimer} 
              onChange={e => updateFooter({ disclaimer: e.target.value })} 
              placeholder="Investment disclaimer..."
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Social Links</Label>
              <p className="text-xs text-muted-foreground">Display social media links in footer</p>
            </div>
            <Switch 
              checked={footer.showSocialLinks} 
              onCheckedChange={v => updateFooter({ showSocialLinks: v })} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Contact Info</Label>
              <p className="text-xs text-muted-foreground">Display contact information in footer</p>
            </div>
            <Switch 
              checked={footer.showContact} 
              onCheckedChange={v => updateFooter({ showContact: v })} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer Sections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Footer Sections</CardTitle>
              <CardDescription>Organize links into columns</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addSection}>
              <Plus className="h-4 w-4 mr-1" /> Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {footer.sections.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No sections yet. Click "Add Section" to create one.
            </p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {footer.sections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span>{section.title || "Untitled Section"}</span>
                      {!section.visible && (
                        <span className="text-xs text-muted-foreground">(hidden)</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    {/* Section Settings */}
                    <div className="flex items-center gap-2">
                      <Input 
                        value={section.title} 
                        onChange={e => updateSection(section.id, { title: e.target.value })} 
                        placeholder="Section Title"
                        className="flex-1"
                      />
                      <Switch 
                        checked={section.visible} 
                        onCheckedChange={v => updateSection(section.id, { visible: v })} 
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeSection(section.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Section Links */}
                    <div className="space-y-2">
                      {section.links.map((link) => (
                        <div key={link.id} className="flex items-center gap-2">
                          <Input 
                            value={link.label} 
                            onChange={e => updateSectionLink(section.id, link.id, 'label', e.target.value)} 
                            placeholder="Link Label"
                            className="flex-1"
                          />
                          <Input 
                            value={link.url} 
                            onChange={e => updateSectionLink(section.id, link.id, 'url', e.target.value)} 
                            placeholder="URL"
                            className="flex-1"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeSectionLink(section.id, link.id)}
                            className="text-destructive hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => addLinkToSection(section.id)}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Link
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Custom Links (Legacy) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Additional Links</CardTitle>
              <CardDescription>Extra links shown at the bottom</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addCustomLink}>
              <Plus className="h-4 w-4 mr-1" /> Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {footer.customLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No additional links
            </p>
          ) : (
            <div className="space-y-3">
              {footer.customLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2">
                  <Input 
                    value={link.label} 
                    onChange={e => updateCustomLink(link.id, 'label', e.target.value)} 
                    placeholder="Link Label"
                    className="flex-1"
                  />
                  <Input 
                    value={link.url} 
                    onChange={e => updateCustomLink(link.id, 'url', e.target.value)} 
                    placeholder="URL"
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeCustomLink(link.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
