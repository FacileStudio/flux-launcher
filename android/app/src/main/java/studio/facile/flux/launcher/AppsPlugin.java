package studio.facile.flux.launcher;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.provider.Settings;
import android.util.Base64;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.ByteArrayOutputStream;
import java.util.List;

@CapacitorPlugin(name = "Apps")
public class AppsPlugin extends Plugin {

    private static final int ICON_SIZE = 96;

    @PluginMethod
    public void list(PluginCall call) {
        PackageManager pm = getContext().getPackageManager();
        Intent main = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER);
        List<ResolveInfo> found = pm.queryIntentActivities(main, 0);
        JSArray apps = new JSArray();
        for (ResolveInfo info : found) {
            JSObject app = new JSObject();
            app.put("packageName", info.activityInfo.packageName);
            app.put("activityName", info.activityInfo.name);
            app.put("label", info.loadLabel(pm).toString());
            app.put("icon", toDataUrl(info.loadIcon(pm)));
            apps.put(app);
        }
        JSObject result = new JSObject();
        result.put("apps", apps);
        call.resolve(result);
    }

    @PluginMethod
    public void launch(PluginCall call) {
        String packageName = call.getString("packageName");
        String activityName = call.getString("activityName");
        if (packageName == null || activityName == null) {
            call.reject("packageName and activityName are required");
            return;
        }
        Intent intent = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER);
        intent.setClassName(packageName, activityName);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        try {
            getContext().startActivity(intent);
            call.resolve();
        } catch (ActivityNotFoundException error) {
            call.reject("No launchable activity " + packageName + "/" + activityName);
        }
    }

    @PluginMethod
    public void openSettings(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null) {
            call.reject("packageName is required");
            return;
        }
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.fromParts("package", packageName, null));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
        call.resolve();
    }

    private static String toDataUrl(Drawable drawable) {
        Bitmap bitmap = Bitmap.createBitmap(ICON_SIZE, ICON_SIZE, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, ICON_SIZE, ICON_SIZE);
        drawable.draw(canvas);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
        return "data:image/png;base64," + Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP);
    }
}
