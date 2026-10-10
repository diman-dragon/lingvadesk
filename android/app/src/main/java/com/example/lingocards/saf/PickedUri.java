package com.example.lingocards.saf;

import android.app.Activity;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import com.example.lingocards.core.Cancelled;

public final class PickedUri {
    public static Uri require(ActivityResult r) throws Cancelled {
        if (r.getResultCode() != Activity.RESULT_OK || r.getData() == null || r.getData().getData() == null) throw new Cancelled();
        return r.getData().getData();
    }
}
