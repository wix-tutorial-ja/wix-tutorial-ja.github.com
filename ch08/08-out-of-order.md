---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 8 ユーザー・インタフェイス再び / 8. 順番外
current: ch08-08
prev: 07-legalese
prev-title: 7. 法律用語
next: 09-dontcha-speak-english
next-title: 9. 英語はわかりませんか
origin: /user-interface-revisited/well-done/
---
# Lesson 8 ユーザー・インタフェイス再び

## 8. 順番外

ウィザード・ページの通常の進行には入らず、エラーなど、順番から外れた条件が発生したことを知らせるダイアログがいくつかあります。
それらのダイアログは、**OnExit** 属性を使って **Show** タグでスケジュールすることが出来ます。
**OnExit** 属性の値は、*success*, *cancel*, *error* または *suspend* です。

    <InstallUISequence>
      <Show Dialog="FatalError" OnExit="error" />
      <Show Dialog="UserExit" OnExit="cancel" />
      <Show Dialog="ExitDialog" OnExit="success" />
      ...
    </InstallUISequence>