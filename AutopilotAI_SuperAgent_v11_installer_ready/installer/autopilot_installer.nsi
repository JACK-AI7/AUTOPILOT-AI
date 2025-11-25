
; NSIS installer script for AutopilotAI SuperAgent
; Requires NSIS to build: https://nsis.sourceforge.io/Download
!include "MUI2.nsh"
Name "AutopilotAI SuperAgent"
OutFile "AutopilotAI-setup.exe"
InstallDir "$PROGRAMFILES\AutopilotAI"
ShowInstDetails show
RequestExecutionLevel admin

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "app\*"
  File /r "server\*"
  ; create shortcuts
  CreateShortCut "$DESKTOP\AutopilotAI.lnk" "$INSTDIR\app\AutopilotAI.exe"
  CreateShortCut "$SMPROGRAMS\AutopilotAI\AutopilotAI.lnk" "$INSTDIR\app\AutopilotAI.exe"
  ; optional: register native messaging host if user agrees
  ${If} ${And} ${Silent} ${Not} 0 ; placeholder for consent dialog
    ; registry write steps here (handled via Exec or WriteRegStr below)
  ${EndIf}
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\AutopilotAI.lnk"
  RMDir /r "$INSTDIR"
SectionEnd
