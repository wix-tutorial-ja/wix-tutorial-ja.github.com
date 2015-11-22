---
layout: default
title: WiX チュートリアル 日本語訳 - Lesson 2 - ユーザー・インタフェイス
current: ch02
prev: /ch01/index
prev-title: Lesson 1 始めよう
next: 01-first-steps
next-title: 1. 最初のステップ
origin: /user-interface/
---
# Lesson 2 ユーザー・インタフェイス

前回のレッスンでは、インストールしたいファイルをどのように記述するかを学びました。
そして、ある製品が既にインストール済みであるかどうかをインストーラが自動的に判断するロジックについて、いくつかの簡単な実装方法を見ました。
しかし、それら全ては、よくあるユーザー・インタフェイスを伴わずに実行され、ユーザーにインストールについて何も言う機会を与えないものでした。
ということで、ユーザー・インタフェイスがこの回で取り扱う主題になります。

Windows Installer は(既に見た簡単な進捗ダイアログと、ポップ・アップしてユーザーにいろんなエラーを通知するメッセージ・ボックスを除いて)
内蔵されたユーザー・インタフェイスを持っていません。
インストーラ・パッケージは自分自身のユーザー・インタフェイスを定義してコンパイルし、自分の `.msi` ファイルに入れて持って回らなければなりません。
このため、ファイルのサイズは多少大きくなります
(典型的なユーザー・インタフェイスを持った `.msi` ファイルは、内部に持つアイコンや他のグラフィカルな要素のサイズにも左右されますが、
最小でも 300 KB をちょっと下回る程度のサイズになってしまいます)。
しかし、サイズと引き替えに、考えられる限りのどんな要求に対してでも、カスタマイズして対応することが可能になっています。

完全なユーザー・インタフェイスを自力で開発することを始めるのは、あまり面白いことではないでしょう。
幸いなことに、そんなことをする必要はありません。
WiX ツールセットには、標準のユーザー・インタフェイス・ライブラリである WixUI が付属しています。
このユーザー・インタフェイスは MSI SDK の作成済みインタフェイスに基づいたものです
(MSI SDK は、Microsoft のビジュアル・プログラミング環境に付属していますが、単体として
[自由にダウンロードする](http://www.microsoft.com/downloads/details.aspx?FamilyId=A55B6B43-E24F-4EA3-A93E-40C0EC4F68E5&displaylang=en)ことも可能です)。
このライブラリが標準的なインストーラ・パッケージの完全なユーザー・インタフェイスを提供してくれます。
その中には、使用許諾契約、顧客情報、標準/カスタム/完全のセットアップ・タイプ、インストール先フォルダの変更、
必要なディスク容量の計算、変更/修復/削除およびロールバックなど、標準的なウィザード・ページが全て含まれています。
唯一の違いは — 個性を演出するために — 基調色が青でなく赤になっていることです。
しかし、それをカスタマイズしたい場合は、二～三のビットマップとアイコンを修正するだけで済みます。