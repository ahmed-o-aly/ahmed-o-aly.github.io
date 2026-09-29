require "fileutils"

# Keep the compiled WebXR modules and scientific data byte-for-byte intact.
# The source app is excluded from Jekyll; only its production bundle is public.
Jekyll::Hooks.register :site, :post_write do |site|
  source = File.join(site.source, "assets/apps/protein-structures")
  destination = File.join(site.dest, "protein-structures")
  unless File.file?(File.join(source, "index.html"))
    raise "Protein Structures bundle is missing. Run npm run build:protein-structures."
  end

  FileUtils.rm_rf(destination)
  FileUtils.mkdir_p(destination)
  FileUtils.cp_r(Dir.glob(File.join(source, "*")), destination)
end
