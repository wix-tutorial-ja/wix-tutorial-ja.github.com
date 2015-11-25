---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 8 ユーザー・インタフェイス再び / 9. 英語はわかりませんか
current: ch08-09
prev: 08-out-of-order
prev-title: 8. 順番外
next: /ch09/index
next-title: Lesson 9 トランスフォーム
origin: /user-interface-revisited/dontcha-speak-english/
---
# Lesson 8 ユーザー・インタフェイス再び

## 9. 英語はわかりませんか

![Localized](/images/localized.png)

インストーラ・パッケージは、ダイアログのテキストや、情報メッセージ、エラー・メッセージなど、
ユーザーに対して表示する大量のテキストを持っています。
私たちはそれらを独立したフラグメントに移動しました。
インストーラを地域化 (ローカライズ) することは、このフラグメント・ファイルの並列コピーを作成して、他の言語に翻訳するだけでも可能です。
しかし、WiX は地域化に対しては、もっと良い手法を提供しており、それに従えば、
地域化すべき全ての文字列を体系的に取りまとめる事が出来て、文字列の置き換えも後のリンクの段階で行うことが出来ます。
ソース中の全てのテキスト・データ (ファイル名も含む) に対して、プリプロセッサ・スタイルの参照を使うことが出来ます。

    <?xml version='1.0' encoding='utf-8'?>
    <Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'>
    
      <Product Name='ほげ 1.0' 
          Id='YOURGUID-86C7-4D14-AEC0-86416A69ABDE'
          Language='!(loc.LANG)' Codepage='932' Version='1.0.0'
          Manufacturer='ぴよソフト'>
    
        <Package Id='*' Keywords='!(loc.Keywords)'
            Description='!(loc.Description)' Comments='!(loc.Comments)'
            InstallerVersion='100' Languages='1041' Compressed='yes'
            SummaryCodepage='932' />

これらの変数の実際の意味は、`.wxl` という拡張子を持った地域化ファイルの中にリスト・アップされます。

    <?xml version="1.0" encoding="utf-8"?>
    <WixLocalization Culture="ja-jp"
        xmlns="http://schemas.microsoft.com/wix/2006/localization">
      <String Id="LANG" Overridable="yes">1041</String>
      <String Id="Keywords" Overridable="yes">
          インストーラ</String>
      <String Id="Description" Overridable="yes">
          ぴよソフト's ほげ 1.0 インストーラ</String>
      <String Id="Comments" Overridable="yes">
          ほげはぴよソフトの登録商標です。</String>
    </WixLocalization>

特定の言語ファイルとともにパッケージをコンパイルするために必要なことは、言語ファイルの名前を WiX のリンカに渡してやることだけです。

    candle.exe Sample.wxs
    light.exe Sample.wixobj -loc Language.wxl