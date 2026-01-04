import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { MenuItem } from "@/types/admin";

export function NavigationSettings() {
  const { settings, updateSiteSettings } = useAdmin();
  const navigation = settings.site.navigation;

  const updateNavigation = (updates: Partial<typeof navigation>) => {
    updateSiteSettings({
      navigation: { ...navigation, ...updates },
    });
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      label: "New Link",
      url: "/",
      visible: true,
    };
    updateNavigation({
      menuItems: [...navigation.menuItems, newItem],
    });
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    updateNavigation({
      menuItems: navigation.menuItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const removeMenuItem = (id: string) => {
    updateNavigation({
      menuItems: navigation.menuItems.filter(item => item.id !== id),
    });
  };

  const addSubMenuItem = (parentId: string) => {
    const newChild: MenuItem = {
      id: crypto.randomUUID(),
      label: "Sub Link",
      url: "/",
      visible: true,
    };
    updateNavigation({
      menuItems: navigation.menuItems.map(item =>
        item.id === parentId 
          ? { ...item, children: [...(item.children || []), newChild] }
          : item
      ),
    });
  };

  const updateSubMenuItem = (parentId: string, childId: string, updates: Partial<MenuItem>) => {
    updateNavigation({
      menuItems: navigation.menuItems.map(item =>
        item.id === parentId
          ? {
              ...item,
              children: item.children?.map(child =>
                child.id === childId ? { ...child, ...updates } : child
              ),
            }
          : item
      ),
    });
  };

  const removeSubMenuItem = (parentId: string, childId: string) => {
    updateNavigation({
      menuItems: navigation.menuItems.map(item =>
        item.id === parentId
          ? { ...item, children: item.children?.filter(child => child.id !== childId) }
          : item
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Display */}
      <Card>
        <CardHeader>
          <CardTitle>Header Display</CardTitle>
          <CardDescription>Control what shows in the header</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Logo</Label>
              <p className="text-xs text-muted-foreground">Display site logo in header</p>
            </div>
            <Switch 
              checked={navigation.showLogo} 
              onCheckedChange={v => updateNavigation({ showLogo: v })} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Site Name</Label>
              <p className="text-xs text-muted-foreground">Display site name next to logo</p>
            </div>
            <Switch 
              checked={navigation.showSiteName} 
              onCheckedChange={v => updateNavigation({ showSiteName: v })} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Configure navigation menu with sub-menus</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addMenuItem}>
              <Plus className="h-4 w-4 mr-1" /> Add Menu
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {navigation.menuItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No menu items. Click "Add Menu" to create one.
            </p>
          ) : (
            <div className="space-y-4">
              {navigation.menuItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  {/* Main menu item */}
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Input 
                      value={item.label} 
                      onChange={e => updateMenuItem(item.id, { label: e.target.value })} 
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input 
                      value={item.url} 
                      onChange={e => updateMenuItem(item.id, { url: e.target.value })} 
                      placeholder="URL"
                      className="flex-1"
                    />
                    <Switch 
                      checked={item.visible} 
                      onCheckedChange={v => updateMenuItem(item.id, { visible: v })} 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeMenuItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sub-menu items */}
                  {item.children && item.children.length > 0 && (
                    <div className="ml-6 space-y-2 border-l-2 border-muted pl-4">
                      {item.children.map((child) => (
                        <div key={child.id} className="flex items-center gap-2">
                          <Input 
                            value={child.label} 
                            onChange={e => updateSubMenuItem(item.id, child.id, { label: e.target.value })} 
                            placeholder="Sub Label"
                            className="flex-1"
                          />
                          <Input 
                            value={child.url} 
                            onChange={e => updateSubMenuItem(item.id, child.id, { url: e.target.value })} 
                            placeholder="URL"
                            className="flex-1"
                          />
                          <Switch 
                            checked={child.visible} 
                            onCheckedChange={v => updateSubMenuItem(item.id, child.id, { visible: v })} 
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeSubMenuItem(item.id, child.id)}
                            className="text-destructive hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add sub-menu button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-6 text-xs"
                    onClick={() => addSubMenuItem(item.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Sub-menu
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
