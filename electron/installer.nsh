; Custom installer script for NSIS
!macro customInstall
  ; Create data directory for offline storage
  CreateDirectory "$APPDATA\VikasGroup\MilkCenter"
  
  ; Set permissions for data directory
  AccessControl::GrantOnFile "$APPDATA\VikasGroup\MilkCenter" "(BU)" "FullAccess"
  
  ; Create desktop shortcut
  CreateShortCut "$DESKTOP\Vikas Milk Center Pro.lnk" "$INSTDIR\${PRODUCT_FILENAME}" "" "$INSTDIR\resources\app\build\icon.ico"
  
  ; Add to startup programs (optional)
  ; WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "VikasGroupMilkCenter" "$INSTDIR\${PRODUCT_FILENAME}"
!macroend

!macro customUnInstall
  ; Remove data directory (optional - you might want to keep user data)
  ; RMDir /r "$APPDATA\VikasGroup\MilkCenter"
  
  ; Remove desktop shortcut
  Delete "$DESKTOP\Vikas Milk Center Pro.lnk"
  
  ; Remove from startup programs
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "VikasGroupMilkCenter"
!macroend