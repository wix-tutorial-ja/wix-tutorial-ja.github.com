---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 12. バージョンごとに
current: ch06-12
prev: 11-complus-applications
prev-title: 11. COM+ アプリケーション
next: /ch07/01-creating-a-database
next-title: 1. データベースを作成する
origin: /com-expression-syntax-miscellanea/version-by-version/
---
#  Lesson 6 COM、式の構文、その他

## 12. バージョンごとに

**Package** タグの **InstallerVersion** 属性は、インストーラ・パッケージが必要としているインストーラのバージョンを記述します。
チュートリアルでは、最小公分母を示したかったために、100 という値 (バージョン 1.0 の意味) を使って来ました。
実際のバージョンを、対応する Windows のバージョンと対比して、下の表で示します。

> 訳註：InstallerVersion 属性は、Major Version × 100 + Minor Version という値で指定します。例えば、バージョン 3.1 なら、301 です。

- *1.x* : *XP 以前* ― 基本的な MSI サポート、32-bit のみ
- *2.0* : *XP, 2000 Server SP3* ― 64-bit サポート
- *3.0* : *XP SP2* ― パッチ機能の改善
- *3.1* : *XP SP3, 2003 Server SP2* ― ユーザー・インタフェイスの改善
- *4.0* : *Vista, Server 2008* ― UAC、再起動マネージャ、MSI 連鎖
- *4.5* : *Vista, Server 2008 SP2* ― パッチ機能の改善
- *5.0* : *Windows 7, 2008 Server R2* ― アクセス許可の設定、サービス制御の改善、UIの改善、ユーザーごとのインストールと全ユーザーのためのインストールの統合

一般的な規則としては、新しいバージョンが本当に要求されるのでない限り、バージョン 3.1 以下を指定することをお奨めします。
バージョン 3.1 の Windows Installer は、Windows 2000 でもサポートされています。

さらに詳細な [変更履歴](http://msdn.microsoft.com/en-us/library/aa372796(VS.85).aspx)
と [説明](http://msdn.microsoft.com/en-us/library/aa371185(VS.85).aspx) が Microsoft のサイトにあります。
これらの文書には、どのパッケージが Windows Update によっては自動的に更新されないけれども再配布可能なダウンロードとして入手できるか、
ということも述べられています。