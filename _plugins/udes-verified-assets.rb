# jekyll-terser has no path-exclusion option and replaces ordinary StaticFiles
# with its minifying subclass. Restore only the verified model assets after
# generation/rendering and before writing. The matching jekyll-minifier excludes
# in _config.yml then copy the source bytes without JavaScript/JSON transforms.
Jekyll::Hooks.register :site, :post_render do |site|
  verified_paths = [
    "assets/js/udes-v2-worker.js",
    "assets/data/udes-v2/baseline.json"
  ]
  site.static_files.map! do |file|
    relative = file.relative_path.tr("\\", "/").sub(%r{\A/}, "")
    if verified_paths.include?(relative)
      Jekyll::StaticFile.new(site, site.source, File.dirname(relative), File.basename(relative))
    else
      file
    end
  end
end
